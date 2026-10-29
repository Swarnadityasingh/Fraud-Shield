
import {
  UserRound,
  Palette,
  BellRing,
  ShieldCheck,
  BrainCircuit,
  Info,
  RefreshCw,
  Save,
  Sun,
  Moon,
  CheckCircle,
  XCircle,
} from 'lucide-react'

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Icon size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
      />
    </label>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
      />
    </label>
  )
}

export default function SettingsPanel({
  settings,
  onChange,
  modelStatus,
  onRefreshModel,
  onSave,
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
    <div
      id="settings"
      className="mx-auto w-full max-w-5xl space-y-6 text-slate-900 dark:text-slate-100"
    >
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          PREFERENCES
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Personalize your dashboard and configure transaction risk labels.
        </p>
      </div>

      {/* Profile */}
      <Section
        icon={UserRound}
        title="Profile"
        description="Manage your demo profile information."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Display name"
            value={settings.profileName}
            onChange={(value) => update('profileName', value)}
          />

          <Field
            label="Email address"
            type="email"
            value={settings.email}
            onChange={(value) => update('email', value)}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Demo profile only. This does not create an account or change login
          credentials.
        </p>
      </Section>

      {/* Appearance */}
      <Section
        icon={Palette}
        title="Appearance"
        description="Choose your preferred dashboard theme. The change applies immediately."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={settings.theme === 'light'}
            onClick={() => update('theme', 'light')}
            className={`rounded-xl border p-4 text-left transition ${
              settings.theme === 'light'
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:border-blue-500 dark:bg-blue-950 dark:ring-blue-900'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun
                size={23}
                className="text-amber-500"
              />
              {settings.theme === 'light' && (
                <CheckCircle size={19} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <p className="mt-3 font-semibold">Light mode</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Bright backgrounds and dark text.
            </p>
          </button>

          <button
            type="button"
            aria-pressed={settings.theme === 'dark'}
            onClick={() => update('theme', 'dark')}
            className={`rounded-xl border p-4 text-left transition ${
              settings.theme === 'dark'
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:border-blue-500 dark:bg-blue-950 dark:ring-blue-900'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon size={23} className="text-blue-500" />
              {settings.theme === 'dark' && (
                <CheckCircle size={19} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <p className="mt-3 font-semibold">Dark mode</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Dark backgrounds and lighter text.
            </p>
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Click a theme to switch instantly, then save to keep your choice
          after refreshing.
        </p>
      </Section>

      {/* Notifications */}
      <Section
        icon={BellRing}
        title="Notifications"
        description="Choose which analysis results should display alert messages."
      >
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <Toggle
            label="High-risk alerts"
            description="Show an alert when a prediction is classified as high risk."
            checked={settings.notifyHighRisk}
            onChange={(value) => update('notifyHighRisk', value)}
          />

          <Toggle
            label="Suspected-fraud alerts"
            description="Show an alert when the model predicts a fraudulent transaction."
            checked={settings.notifyFraud}
            onChange={(value) => update('notifyFraud', value)}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          These preferences affect messages shown during analysis. They do not
          send emails or background push notifications.
        </p>
      </Section>

      {/* Risk thresholds */}
      <Section
        icon={ShieldCheck}
        title="Risk configuration"
        description="Set the probability thresholds used to label prediction risk."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Medium risk starts at (%)"
            type="number"
            value={settings.mediumThreshold}
            onChange={(value) => update('mediumThreshold', value)}
          />

          <Field
            label="High risk starts at (%)"
            type="number"
            value={settings.highThreshold}
            onChange={(value) => update('highThreshold', value)}
          />
        </div>

        {!thresholdsValid && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Invalid thresholds. Use a medium threshold of at least 1%, a high
            threshold of at most 100%, and ensure medium is lower than high.
          </p>
        )}

        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold">Current risk rules</p>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">
                Low risk
              </span>
              <span className="font-medium">
                Below {Number.isFinite(medium) ? medium : '—'}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">
                Medium risk
              </span>
              <span className="font-medium">
                {Number.isFinite(medium) ? medium : '—'}% to below{' '}
                {Number.isFinite(high) ? high : '—'}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">
                High risk
              </span>
              <span className="font-medium">
                {Number.isFinite(high) ? high : '—'}% and above
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          These thresholds change the displayed risk category, not the model's
          underlying fraud probability or accuracy.
        </p>
      </Section>

      {/* Model status */}
      <Section
        icon={BrainCircuit}
        title="Model information"
        description="Check whether the API and trained model are available."
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            {modelStatus.modelConnected ? (
              <CheckCircle
                size={22}
                className="mt-0.5 text-green-600"
              />
            ) : (
              <XCircle
                size={22}
                className="mt-0.5 text-amber-600"
              />
            )}

            <div>
              <p className="font-medium">{statusText}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Health check endpoint: /health
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefreshModel}
            disabled={modelStatus.loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={modelStatus.loading ? 'animate-spin' : ''}
            />
            Refresh status
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Model type
            </p>
            <p className="mt-1 font-semibold">Random Forest</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dataset
            </p>
            <p className="mt-1 font-semibold">PaySim synthetic data</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input features
            </p>
            <p className="mt-1 font-semibold">Step, type, amount</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluation
            </p>
            <p className="mt-1 font-semibold">
              See training output
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Model details describe the expected project configuration. Confirm
          the actual saved model and training metrics in your backend before
          presenting them as verified results.
        </p>
      </Section>

      {/* About */}
      <Section
        icon={Info}
        title="About FraudShield"
        description="Machine Learning Based Financial Risk Assessment and Fraud Detection Framework."
      >
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex justify-between gap-4">
            <span>Frontend</span>
            <span className="text-right font-medium text-slate-900 dark:text-white">
              React, Vite, Tailwind CSS
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Backend</span>
            <span className="text-right font-medium text-slate-900 dark:text-white">
              Python, FastAPI
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Machine learning</span>
            <span className="text-right font-medium text-slate-900 dark:text-white">
              scikit-learn
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Project version</span>
            <span className="font-medium text-slate-900 dark:text-white">
              1.0.0
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          FraudShield is an educational project using synthetic transaction
          data. Predictions are experimental and must not be treated as proof
          of fraud or used as the sole basis for financial decisions.
        </div>
      </Section>

      {/* Save button */}
      <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Save your preferences to keep them after a page refresh.
        </p>

        <button
          type="button"
          disabled={!thresholdsValid}
          onClick={onSave}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />
          Save settings
        </button>
      </div>
    </div>
  )
}
