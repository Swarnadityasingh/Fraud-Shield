import {
  LayoutGrid,
  ChartColumn,
  FileChartColumn,
  Folder,
  Settings as SettingsIcon,
  LogOut,
  Crown,
  ShieldAlert,
  CreditCard,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import './Sidebar.css'

export default function Sidebar({
  activePage,
  userName,
  sidebarCollapsed,
  sidebarWidth,
  sidebarRef,
  onNavigate,
  onDoubleClick,
  onOpenPlans,
  onLogoutRequest,
  onShowMessage,
  onToggleSidebar,
}) {
  const links = [
    {
      name: 'Dashboard',
      icon: LayoutGrid,
      onClick: () => onNavigate('Dashboard'),
    },
    {
      name: 'Fraud Detection',
      icon: ShieldAlert,
      onClick: () => onNavigate('Fraud Detection'),
    },
    {
      name: 'Credit Risk',
      icon: CreditCard,
      onClick: () => onNavigate('Credit Risk'),
    },
    {
      name: 'Unified Risk',
      icon: Layers,
      onClick: () => onNavigate('Unified Risk'),
    },
    {
      name: 'Analytics',
      icon: ChartColumn,
      onClick: () => onNavigate('Analytics'),
    },
    {
      name: 'Reports',
      icon: FileChartColumn,
      onClick: () => onNavigate('Reports'),
    },
    {
      name: 'Files',
      icon: Folder,
      onClick: () =>
        onShowMessage('File management is not available yet.'),
    },
    {
      name: 'Settings',
      icon: SettingsIcon,
      onClick: () => onNavigate('Settings', 'settings'),
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      className={`dashboard-sidebar ${
        sidebarCollapsed ? 'dashboard-sidebar-collapsed' : ''
      }`}
      style={{ '--dashboard-sidebar-width': `${sidebarWidth}px` }}
      onDoubleClick={onDoubleClick}
    >

      <div className="dashboard-brand-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon-wrapper">
            <ShieldAlert size={20} />
          </div>
          <div className="dashboard-brand-copy">
            <h2>FraudShield</h2>
            <p>Risk Intelligence OS</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      <p className="sidebar-section-label">WORKSPACE</p>
      <nav className="dashboard-navigation" aria-label="Workspace navigation">
        {links.map(({ name, icon: Icon, onClick }) => (
          <button
            key={name}
            type="button"
            data-label={name}
            onClick={onClick}
            className={`dashboard-nav-item ${
              activePage === name ? 'active' : ''
            }`}
            title={name}
            aria-label={name}
            aria-current={activePage === name ? 'page' : undefined}
          >
            <Icon size={18} className="nav-icon" />
            <span className="nav-text">{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-account-footer">
        <div className="sidebar-upgrade-card">
          <div className="upgrade-card-content">
            <Crown size={14} className="upgrade-crown" />
            <span className="upgrade-text">Free Tier</span>
          </div>
          <button
            type="button"
            onClick={onOpenPlans}
            className="upgrade-btn-mini"
            title="Upgrade Plan"
          >
            <span>Upgrade</span>
            <Crown size={12} className="upgrade-icon-collapsed" />
          </button>
        </div>

        <button
          className="sidebar-user-profile"
          type="button"
          onClick={() => onNavigate('Settings', 'settings')}
          aria-label="Open account settings"
          title={userName}
        >
          <span className="sidebar-user-avatar" aria-hidden="true">
            {userName.trim().slice(0, 1).toUpperCase()}
          </span>

          <span className="sidebar-user-details">
            <strong>{userName}</strong>
            <small>Personal workspace</small>
          </span>
        </button>

        <button
          type="button"
          className="dashboard-nav-item sidebar-nav-logout"
          onClick={onLogoutRequest}
          title="Logout"
          aria-label="Logout from FraudShield"
        >
          <LogOut size={18} aria-hidden="true" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  )
}
