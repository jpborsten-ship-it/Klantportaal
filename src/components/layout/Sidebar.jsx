import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/orders', label: 'Orders' },
  { to: '/finance', label: 'Finance' },
  { to: '/leveragenda', label: 'Leveragenda' },
  { to: '/mijn-gegevens', label: 'Mijn gegevens' },
  { to: '/retouren', label: 'Retouren' },
  { to: '/faq', label: 'FAQ' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">PartsProfi</div>
      <ul>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
