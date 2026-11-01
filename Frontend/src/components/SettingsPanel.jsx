import {
  UserRound,
  BellRing,
  ShieldCheck,
  BrainCircuit,
  Info,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import './SettingsPanel.css'

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="settings-section">
      <div className="settings-section-heading">
        <div className="settings-section-icon">
          <Icon size={19} />
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </section>
  )
}

function SettingsField({ label, value, onChange, type = 'text', min, max }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ''}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <label className="settings-toggle">
      <span className="settings-toggle-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span className="settings-switch" aria-hidden="true" />
    </label>
  )
}

export default function SettingsPanel({
  settings,
  onChange,
  modelStatus,
  onRefreshModel,
}) {
  function update(key, value) {
    onChange({ ...settings, [key]: value })
  }

  const medium = Number(settings.mediumThreshold)
  const high = Number(settings.highThreshold)

  const thresholdsValid =
    Number.isFinite(medium) &&
    Number.isFinite(high) &&
    medium >= 1 &&
    high <= 100 &&
    medium < high

  const statusText = modelStatus.loading
    ? 'Checking backend connection...'
    : modelStatus.error
      ? modelStatus.error
      : modelStatus.modelConnected
        ? 'Backend online · ML model loaded'
        : modelStatus.online
          ? 'Backend online · ML model not loaded'
          : 'Backend unavailable'

  return (
    <div className="settings-panel" id="settings">

      <SettingsSection
        icon={UserRound}
        title="General preferences"
        description="Your FraudShield demo workspace information."
      >
        <div className="settings-fields-grid">
          <SettingsField
            label="Display name"
            value={settings.profileName}
            onChange={(value) => update('profileName', value)}
          />

          <SettingsField
            label="Email address"
            type="email"
            value={settings.email}
            onChange={(value) => update('email', value)}
          />
        </div>

        <p className="settings-helper">
          Demo profile only. These details do not change login credentials.
        </p>
      </SettingsSection>

      <SettingsSection
        icon={ShieldCheck}
        title="Risk & alerts"
        description="Configure risk classification thresholds and alert preferences."
      >
        <div className="settings-fields-grid">
          <SettingsField
            label="Medium risk starts at (%)"
            type="number"
            min="1"
            max="99"
            value={settings.mediumThreshold}
            onChange={(value) => update('mediumThreshold', value)}
          />

          <SettingsField
            label="High risk starts at (%)"
            type="number"
            min="2"
            max="100"
            value={settings.highThreshold}
            onChange={(value) => update('highThreshold', value)}
          />
        </div>

        {!thresholdsValid && (
          <p className="settings-validation">
            Invalid thresholds. Medium must be at least 1%, high must be at
            most 100%, and medium must be lower than high.
          </p>
        )}

        <div className="settings-risk-preview">
          <strong>Current risk rules</strong>

          <div className="settings-risk-row">
            <span>
              <i className="risk-dot low-dot" /> Low risk
            </span>
            <strong>Below {Number.isFinite(medium) ? medium : '—'}%</strong>
          </div>

          <div className="settings-risk-row">
            <span>
              <i className="risk-dot medium-dot" /> Medium risk
            </span>
            <strong>
              {Number.isFinite(medium) ? medium : '—'}% to below{' '}
              {Number.isFinite(high) ? high : '—'}%
            </strong>
          </div>

          <div className="settings-risk-row">
            <span>
              <i className="risk-dot high-dot" /> High risk
            </span>
            <strong>{Number.isFinite(high) ? high : '—'}% and above</strong>
          </div>
        </div>

        <div className="settings-toggle-list">
          <SettingsToggle
            label="High-risk alerts"
            description="Show an alert when a transaction is classified as high risk."
            checked={settings.notifyHighRisk}
            onChange={(value) => update('notifyHighRisk', value)}
          />

          <SettingsToggle
            label="Suspected-fraud alerts"
            description="Show an alert when the model predicts a fraudulent transaction."
            checked={settings.notifyFraud}
            onChange={(value) => update('notifyFraud', value)}
          />
        </div>

        <p className="settings-helper">
          Thresholds change the displayed risk classification, not the model's
          underlying fraud probability or accuracy. Alert preferences control
          application messages; they do not send emails or push notifications.
        </p>
      </SettingsSection>

      <SettingsSection
        icon={BrainCircuit}
        title="System & model"
        description="Monitor backend connectivity and review the configured model."
      >
        <div className="settings-model-status">
          <div className="settings-model-copy">
            {modelStatus.modelConnected ? (
              <CheckCircle size={21} className="model-connected-icon" />
            ) : (
              <XCircle size={21} className="model-disconnected-icon" />
            )}

            <div>
              <strong>{statusText}</strong>
              <small>Health check endpoint: /health</small>
            </div>
          </div>

          <button
            type="button"
            className="settings-refresh-button"
            onClick={onRefreshModel}
            disabled={modelStatus.loading}
          >
            <RefreshCw
              size={15}
              className={modelStatus.loading ? 'settings-spinning' : ''}
            />
            Refresh status
          </button>
        </div>

        <div className="settings-system-grid">
          <div>
            <span>Model type</span>
            <strong>Random Forest</strong>
          </div>

          <div>
            <span>Dataset</span>
            <strong>PaySim synthetic data</strong>
          </div>

          <div>
            <span>Input features</span>
            <strong>Step, type, amount</strong>
          </div>

          <div>
            <span>Evaluation</span>
            <strong>See training output</strong>
          </div>
        </div>

        <p className="settings-helper">
          These describe the expected project configuration. Verify the
          backend model and training results before presenting them as
          confirmed metrics.
        </p>
      </SettingsSection>

      <SettingsSection
        icon={Info}
        title="About FraudShield"
        description="Machine Learning-Based Financial Risk Assessment and Fraud Detection Framework."
      >
        <div className="settings-about-list">
          <div>
            <span>Frontend</span>
            <strong>React, Vite, Tailwind CSS</strong>
          </div>
          <div>
            <span>Backend</span>
            <strong>Python, FastAPI</strong>
          </div>
          <div>
            <span>Machine learning</span>
            <strong>scikit-learn</strong>
          </div>
          <div>
            <span>Project version</span>
            <strong>1.0.0</strong>
          </div>
        </div>

        <div className="settings-disclaimer">
          FraudShield is an educational project using synthetic transaction
          data. Predictions are experimental and must not be treated as proof
          of fraud or used as the sole basis for financial decisions.
        </div>
      </SettingsSection>

      <p className="settings-autosave-note">
        Your valid preference changes are saved automatically.
      </p>
    </div>
  )
}