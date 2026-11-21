"""Prepare review-only holdout inputs. No fitting, prediction, HTTP or database use.

Writes new files with exclusive creation only in this draft directory.
"""
import hashlib
import json
from pathlib import Path
import platform

import joblib
import numpy as np
import pandas as pd
import pyarrow.parquet as pq
import sklearn
from sklearn.model_selection import train_test_split

OUT = Path(__file__).resolve().parent
BASE = Path(r'C:\Users\Arpit Srivastava\FraudShield-Backups\2026-11-18_205620_IST')
REPO = BASE/'repository'
INVENTORY = {x['relative_path']:x for x in json.loads((BASE/'preservation/inventory.json').read_text())}

def sha(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream,'sha256').hexdigest()

sources={}
def verify(path):
    rel=path.relative_to(BASE).as_posix()
    actual=sha(path)
    assert actual==INVENTORY[rel]['sha256'], rel
    sources[rel]={'sha256':actual,'size_bytes':path.stat().st_size}

def create_json(name,value):
    path=OUT/name
    with path.open('x',encoding='utf-8',newline='\n') as stream:
        json.dump(value,stream,indent=2,allow_nan=False);stream.write('\n')
    return sha(path)

records=[]
checks={}
splits_dir=REPO/'Backend/data/processed'
fraud_parts={}
for split in ('train','validation','holdout'):
    path=splits_dir/f'{split}.parquet';verify(path)
    fraud_parts[split]=pq.read_table(path,columns=['TransactionID','TransactionDT','isFraud']).to_pandas()
    assert fraud_parts[split].TransactionID.is_unique
    assert fraud_parts[split].TransactionDT.is_monotonic_increasing
sets={name:set(frame.TransactionID) for name,frame in fraud_parts.items()}
assert all(not sets[a]&sets[b] for a,b in [('train','validation'),('train','holdout'),('validation','holdout')])
assert fraud_parts['train'].TransactionDT.max() < fraud_parts['validation'].TransactionDT.min()
assert fraud_parts['validation'].TransactionDT.max() < fraud_parts['holdout'].TransactionDT.min()
expected=pd.read_csv(REPO/'Backend/reports/research/fraud/distribution.csv')
for _,row in expected.iterrows():
    frame=fraud_parts[row['split']]
    assert len(frame)==row['rows'] and int(frame.isFraud.sum())==row['positive']
selected_fraud=[]
for label in (0,1):
    selected_fraud.append(int(fraud_parts['holdout'].query('isFraud == @label').sort_values('TransactionID').iloc[0].TransactionID))
hold=pq.read_table(splits_dir/'holdout.parquet',filters=[('TransactionID','in',selected_fraud)]).to_pandas()
tx_path=BASE/'public_datasets/IEEE-CIS/train_transaction.csv';verify(tx_path)
id_path=BASE/'public_datasets/IEEE-CIS/train_identity.csv';verify(id_path)
found=[]
for chunk in pd.read_csv(tx_path,chunksize=20000):
    rows=chunk[chunk.TransactionID.isin(selected_fraud)]
    if len(rows):found.append(rows)
    if sum(len(x) for x in found)==len(selected_fraud):break
raw_tx=pd.concat(found)
identity=pd.read_csv(id_path)
identity.columns=[c.replace('id-','id_') if c.startswith('id-') else c for c in identity.columns]
joined=raw_tx.merge(identity,on='TransactionID',how='left',validate='one_to_one')
model_path=REPO/'Backend/app/models/fraud_selected.joblib';verify(model_path)
model=joblib.load(model_path);fraud_features=list(model.feature_names_in_)
assert len(fraud_features)==431
checks['fraud']={'partition_rows':{k:len(v) for k,v in fraud_parts.items()},'unique_ids':True,'disjoint_partitions':True,'strict_temporal_boundaries':True,'saved_distribution_matches':True,'selected_raw_csv_join_matches':True}

def plain(value):
    if pd.isna(value):return None
    return value.item() if hasattr(value,'item') else value

for ident in selected_fraud:
    row=hold.loc[hold.TransactionID==ident].iloc[0]
    raw=joined.loc[joined.TransactionID==ident].iloc[0]
    for key in fraud_features:
        assert (pd.isna(row[key]) and pd.isna(raw[key])) or row[key]==raw[key], key
    features={key:plain(row[key]) for key in fraud_features}
    assert not set(features)&{'TransactionID','isFraud','V107'}
    filename=f'demo-fraud-{ident}.json'
    payload_sha=create_json(filename,{'features':features})
    records.append({'dataset':'IEEE-CIS','source_id':ident,'split':'holdout','true_label_metadata_only':int(row.isFraud),'TransactionDT_metadata_only':int(row.TransactionDT),'model_sha256':sha(model_path),'decision_threshold':float(model.decision_threshold_),'feature_count':len(features),'payload_file':filename,'payload_sha256':payload_sha,'raw_source_verified':True,'not_in_training_or_validation':ident not in sets['train']|sets['validation'],'prediction_executed':False,'application_submission_executed':False})

credit_path=BASE/'public_datasets/GiveMeSomeCredit/cs-training.csv';verify(credit_path)
data=pd.read_csv(credit_path);target='SeriousDlqin2yrs'
assert len(data)==150000 and data['Unnamed: 0'].is_unique
train,held=train_test_split(data,test_size=.30,random_state=42,stratify=data[target])
val,test=train_test_split(held,test_size=.5,random_state=42,stratify=held[target])
parts={'train':train,'validation':val,'holdout':test}
ids={k:set(v['Unnamed: 0']) for k,v in parts.items()}
assert all(not ids[a]&ids[b] for a,b in [('train','validation'),('train','holdout'),('validation','holdout')])
assert set.union(*ids.values())==set(data['Unnamed: 0'])
expected=pd.read_csv(REPO/'Backend/reports/research/credit/distribution.csv')
memberships={}
for _,row in expected.iterrows():
    frame=parts[row['split']]
    assert len(frame)==row['rows'] and int(frame[target].sum())==row['positive']
    canonical='\n'.join(str(int(x)) for x in sorted(frame['Unnamed: 0']))+'\n'
    memberships[row['split']]=hashlib.sha256(canonical.encode()).hexdigest()
checks['credit']={'reconstructed_with_existing_two_stage_stratified_split':True,'seed':42,'partition_rows':{k:len(v) for k,v in parts.items()},'saved_distribution_matches':True,'unique_ids':True,'disjoint_partitions':True,'complete_id_coverage':True,'membership_hash_definition':'SHA256 of ascending numeric source IDs, decimal text, LF-separated with final LF','membership_sha256':memberships,'limitation':'No prior saved membership manifest exists to compare against; reconstruction matches the preserved algorithm, raw-file hash and distribution counts.'}
model_path=REPO/'Backend/app/models/credit_selected.joblib';verify(model_path)
model=joblib.load(model_path);features_keys=list(model.feature_names_in_)
assert len(features_keys)==10
for label in (0,1):
    row=test[test[target]==label].sort_values('Unnamed: 0').iloc[0]
    ident=int(row['Unnamed: 0'])
    features={key:plain(row[key]) for key in features_keys}
    assert not set(features)&{'Unnamed: 0',target}
    filename=f'demo-credit-{ident}.json'
    payload_sha=create_json(filename,{'features':features})
    records.append({'dataset':'Give Me Some Credit','source_id':ident,'source_dataframe_index_zero_based':int(row.name),'split':'holdout','true_label_metadata_only':int(row[target]),'model_sha256':sha(model_path),'decision_threshold':float(model.decision_threshold_),'feature_count':len(features),'payload_file':filename,'payload_sha256':payload_sha,'not_in_training_or_validation':ident not in ids['train']|ids['validation'],'prediction_executed':False,'application_submission_executed':False})

manifest={'status':'REVIEW REQUIRED: no inference or live submissions authorized in this stage','baseline':str(BASE),'selection_rule':'For each dataset and each true class 0 and 1, select the holdout record with the smallest numeric source ID. No score-based selection.','scope':'Four illustrative integration examples, not new evaluation evidence; true class does not guarantee model output.','environment':{'python':platform.python_version(),'pandas':pd.__version__,'numpy':np.__version__,'scikit_learn':sklearn.__version__},'verification':checks,'sources':sources,'records':records}
create_json('demo-selection-manifest.json',manifest)
for rel,entry in sources.items():assert sha(BASE/rel)==entry['sha256']
print(json.dumps({'checks':checks,'selected_records':[{'dataset':r['dataset'],'source_id':r['source_id'],'label':r['true_label_metadata_only'],'feature_count':r['feature_count']} for r in records],'prediction_or_submission_executed':False},indent=2))
