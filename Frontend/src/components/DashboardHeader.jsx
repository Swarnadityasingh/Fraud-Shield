import {
  Bell,
  BellOff,
  Sun,
  Moon,
} from 'lucide-react'

export default function DashboardHeader({
  activePage,
  settings,
  onToggleTheme,
  notificationsEnabled,
  notificationsOpen,
  setNotificationsOpen,
  notificationWrapperRef,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  themeToast,
  themeToastPhase,
}) {
  const pageTitle =
    activePage === 'Settings' ? 'Settings' : 'Dashboard'

  const pageDescription =
    activePage === 'Settings'
      ? 'Manage your preferences, risk rules and system configuration.'
      : 'Financial transaction monitoring'

  return (
    <header className="dashboard-header">
      <div>
        <span className="dashboard-eyebrow">
          FINANCIAL INTELLIGENCE PLATFORM
        </span>

        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className={`theme-toggle-button ${
            settings.theme === 'dark' ? 'is-dark' : ''
          }`}
          onClick={onToggleTheme}
          aria-label={
            settings.theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          aria-pressed={settings.theme === 'dark'}
          title={
            settings.theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
        >
          <span className="theme-toggle-thumb" aria-hidden="true" />
          <Sun className="theme-toggle-sun" size={16} aria-hidden="true" />
          <Moon className="theme-toggle-moon" size={16} aria-hidden="true" />
        </button>

        <div ref={notificationWrapperRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`notification-button ${
              notificationsEnabled ? '' : 'is-disabled'
            }`}
            aria-label={
              notificationsEnabled
                ? 'Notifications'
                : 'Notifications disabled'
            }
            aria-expanded={notificationsOpen}
            title={
              notificationsEnabled
                ? 'Notifications'
                : 'Notifications are disabled in Settings'
            }
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            {notificationsEnabled ? (
              <Bell size={17} aria-hidden="true" />
            ) : (
              <BellOff size={17} aria-hidden="true" />
            )}

            {notificationsEnabled &&
              notifications.some((item) => !item.read) && (
                <span className="notification-indicator" />
              )}
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {notifications.filter((item) => !item.read).length} unread
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onMarkAllNotificationsRead}
                >
                  Mark all read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <Bell size={22} />
                  <strong>You're all caught up</strong>
                  <span>
                    Fraud and risk alerts will appear here.
                  </span>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`notification-item severity-${item.severity} ${
                        item.read ? 'read' : ''
                      }`}
                      onClick={() => onMarkNotificationRead(item.id)}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <small>
                        {new Date(item.createdAt).toLocaleTimeString('en-IN')}
                      </small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {themeToast && (
          <div
            key={themeToast}
            className={`theme-toast theme-toast-${themeToastPhase}`}
            role="status"
          >
            {themeToast}
          </div>
        )}
      </div>
    </header>
  )
}
