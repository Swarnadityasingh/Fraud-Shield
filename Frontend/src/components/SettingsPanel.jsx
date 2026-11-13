import { useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import {
  UserRound,
  BellRing,
  ShieldCheck,
  BrainCircuit,
  Fingerprint,
  Info,
  RefreshCw,
  CheckCircle,
  XCircle,
  Camera,
  Link2,
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
  currentUser,
  accessToken,
  onCurrentUserChange,
  modelStatus,
  onRefreshModel,
}) {
  const profileInputRef = useRef(null)
  const [accountMessage, setAccountMessage] = useState('')
  const [accountError, setAccountError] = useState('')
  const [accountBusy, setAccountBusy] = useState(false)

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

  const accountName = currentUser?.full_name || settings.profileName || 'FraudShield user'
  const accountEmail = currentUser?.email || settings.email || 'No email available'
  const accountInitials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')
  const authProviders = Array.isArray(currentUser?.auth_providers)
    ? currentUser.auth_providers
    : [currentUser?.auth_provider || (currentUser?.profile_picture ? 'google' : 'password')]
  const isGoogleAccount = authProviders.includes('google')
  const hasPasswordSignIn = authProviders.includes('password')

  async function updateAccount(endpoint, options) {
    const response = await fetch(`http://localhost:8000/auth/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.detail || 'Account update failed.')
    }

    if (data.user) {
      onCurrentUserChange(data.user)
    }

    return data
  }

  async function handleProfilePicture(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAccountError('Use a JPG, PNG, or WebP image.')
      setAccountMessage('')
      return
    }

    if (file.size > 2_500_000) {
      setAccountError('Profile image must be smaller than 2.5 MB.')
      setAccountMessage('')
      return
    }

    setAccountBusy(true)
    setAccountError('')
    setAccountMessage('')

    try {
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Could not read the selected image.'))
        reader.readAsDataURL(file)
      })
      const data = await updateAccount('profile-picture', {
        method: 'PUT',
        body: JSON.stringify({ image_data: imageData }),
      })
      setAccountMessage(data.message)
    } catch (error) {
      setAccountError(error.message)
    } finally {
      setAccountBusy(false)
    }
  }

  async function handleGoogleLink(credentialResponse) {
    if (!credentialResponse?.credential) {
      setAccountError('Google did not provide a valid credential.')
      return
    }

    setAccountBusy(true)
    setAccountError('')
    setAccountMessage('')

    try {
      const data = await updateAccount('google/link', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })
      setAccountMessage(data.message)
    } catch (error) {
      setAccountError(error.message)
    } finally {
      setAccountBusy(false)
    }
  }

  return (
    <div className="settings-panel" id="settings">

      <SettingsSection
        icon={Fingerprint}
        title="Account & sign-in"
        description="Your authenticated FraudShield account and sign-in details."
      >
        <div className="settings-account-card">
          <div className="settings-account-identity">
            <div className="settings-avatar-control">
              {currentUser?.profile_picture ? (
                <img
                  className="settings-account-avatar"
                  src={currentUser.profile_picture}
                  alt={`${accountName} profile`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="settings-account-avatar settings-account-initials" aria-hidden="true">
                  {accountInitials}
                </span>
              )}
              <button
                type="button"
                className="settings-avatar-button"
                onClick={() => profileInputRef.current?.click()}
                disabled={accountBusy}
                aria-label="Change profile picture"
              >
                <Camera size={14} />
              </button>
              <input
                ref={profileInputRef}
                className="settings-avatar-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePicture}
              />
            </div>

            <div className="settings-account-copy">
              <strong>{accountName}</strong>
              <span>{accountEmail}</span>

              <div className="settings-account-badges">
                <span className={`settings-provider-badge ${isGoogleAccount ? 'is-google' : ''}`}>
                  {isGoogleAccount && <b aria-hidden="true">G</b>}
                  {isGoogleAccount && hasPasswordSignIn
                    ? 'Google + email sign-in'
                    : isGoogleAccount
                      ? 'Signed in with Google'
                      : 'Email & password'}
                </span>

                <span className={`settings-verification-badge ${currentUser?.is_email_verified ? 'is-verified' : ''}`}>
                  <CheckCircle size={13} aria-hidden="true" />
                  {currentUser?.is_email_verified ? 'Email verified' : 'Verification pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="settings-account-summary">
            <span>Sign-in method</span>
            <strong>
              {isGoogleAccount && hasPasswordSignIn
                ? 'Google OAuth + password'
                : isGoogleAccount
                  ? 'Google OAuth'
                  : 'Email and password'}
            </strong>
            <small>
              {isGoogleAccount
                ? 'Google is connected to this FraudShield account'
                : 'Connect Google to enable either sign-in method'}
            </small>
          </div>
        </div>

        <div className="settings-account-actions">
          <button
            type="button"
            className="settings-picture-action"
            onClick={() => profileInputRef.current?.click()}
            disabled={accountBusy}
          >
            <Camera size={15} />
            Change profile picture
          </button>

          {!isGoogleAccount && (
            <div className="settings-google-link">
              <span><Link2 size={15} /> Connect the matching Google account</span>
              <GoogleLogin
                onSuccess={handleGoogleLink}
                onError={() => setAccountError('Google connection was cancelled or failed.')}
                text="continue_with"
                shape="pill"
                size="medium"
              />
            </div>
          )}
        </div>

        {accountMessage && <p className="settings-account-message is-success">{accountMessage}</p>}
        {accountError && <p className="settings-account-message is-error">{accountError}</p>}
      </SettingsSection>

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
              <span className="settings-model-label">Model status</span>
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
