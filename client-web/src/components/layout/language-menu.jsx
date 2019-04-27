import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageMenu() {
  const { t, i18n } = useTranslation();

  const _changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <li className="nav-item dropdown">
      <a
        className="dropdown-toggle text-light"
        data-toggle="dropdown"
        href="#"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span dangerouslySetInnerHTML={{__html: t('flag')}}></span>
      </a>
      <div className="dropdown-menu shadow mt-2 rounded-top-0 dropdown-menu-right">
        <a className="dropdown-item" href="#" onClick={() => _changeLanguage('vi')}>
          <img
            width="22"
            className="mr-1 mb-1"
            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0Q4MDAyNzsiIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI1NiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojRkZEQTQ0OyIgcG9pbnRzPSIyNTYsMTMzLjU2NSAyODMuNjI4LDIxOC41OTQgMzczLjAzMywyMTguNTk0IDMwMC43MDIsMjcxLjE0NCAzMjguMzMsMzU2LjE3NCAyNTYsMzAzLjYyMyAgIDE4My42NywzNTYuMTc0IDIxMS4yOTgsMjcxLjE0NCAxMzguOTY4LDIxOC41OTQgMjI4LjM3MiwyMTguNTk0ICIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
            alt="Tiếng Việt"
          />
          Tiếng Việt
        </a>
        <a className="dropdown-item" href="#" onClick={() => _changeLanguage('en')}>
          <img
            width="22"
            className="mr-1 mb-1"
            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0YwRjBGMDsiIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI1NiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDUyQjQ7IiBkPSJNNTIuOTIsMTAwLjE0MmMtMjAuMTA5LDI2LjE2My0zNS4yNzIsNTYuMzE4LTQ0LjEwMSw4OS4wNzdoMTMzLjE3OEw1Mi45MiwxMDAuMTQyeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzAwNTJCNDsiIGQ9Ik01MDMuMTgxLDE4OS4yMTljLTguODI5LTMyLjc1OC0yMy45OTMtNjIuOTEzLTQ0LjEwMS04OS4wNzZsLTg5LjA3NSw4OS4wNzZINTAzLjE4MXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDUyQjQ7IiBkPSJNOC44MTksMzIyLjc4NGM4LjgzLDMyLjc1OCwyMy45OTMsNjIuOTEzLDQ0LjEwMSw4OS4wNzVsODkuMDc0LTg5LjA3NUw4LjgxOSwzMjIuNzg0TDguODE5LDMyMi43ODQgICB6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA1MkI0OyIgZD0iTTQxMS44NTgsNTIuOTIxYy0yNi4xNjMtMjAuMTA5LTU2LjMxNy0zNS4yNzItODkuMDc2LTQ0LjEwMnYxMzMuMTc3TDQxMS44NTgsNTIuOTIxeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzAwNTJCNDsiIGQ9Ik0xMDAuMTQyLDQ1OS4wNzljMjYuMTYzLDIwLjEwOSw1Ni4zMTgsMzUuMjcyLDg5LjA3Niw0NC4xMDJWMzcwLjAwNUwxMDAuMTQyLDQ1OS4wNzl6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA1MkI0OyIgZD0iTTE4OS4yMTcsOC44MTljLTMyLjc1OCw4LjgzLTYyLjkxMywyMy45OTMtODkuMDc1LDQ0LjEwMWw4OS4wNzUsODkuMDc1VjguODE5eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzAwNTJCNDsiIGQ9Ik0zMjIuNzgzLDUwMy4xODFjMzIuNzU4LTguODMsNjIuOTEzLTIzLjk5Myw4OS4wNzUtNDQuMTAxbC04OS4wNzUtODkuMDc1VjUwMy4xODF6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA1MkI0OyIgZD0iTTM3MC4wMDUsMzIyLjc4NGw4OS4wNzUsODkuMDc2YzIwLjEwOC0yNi4xNjIsMzUuMjcyLTU2LjMxOCw0NC4xMDEtODkuMDc2SDM3MC4wMDV6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRDgwMDI3OyIgZD0iTTUwOS44MzMsMjIyLjYwOWgtMjIwLjQ0aC0wLjAwMVYyLjE2N0MyNzguNDYxLDAuNzQ0LDI2Ny4zMTcsMCwyNTYsMCAgIGMtMTEuMzE5LDAtMjIuNDYxLDAuNzQ0LTMzLjM5MSwyLjE2N3YyMjAuNDR2MC4wMDFIMi4xNjdDMC43NDQsMjMzLjUzOSwwLDI0NC42ODMsMCwyNTZjMCwxMS4zMTksMC43NDQsMjIuNDYxLDIuMTY3LDMzLjM5MSAgIGgyMjAuNDRoMC4wMDF2MjIwLjQ0MkMyMzMuNTM5LDUxMS4yNTYsMjQ0LjY4MSw1MTIsMjU2LDUxMmMxMS4zMTcsMCwyMi40NjEtMC43NDMsMzMuMzkxLTIuMTY3di0yMjAuNDR2LTAuMDAxaDIyMC40NDIgICBDNTExLjI1NiwyNzguNDYxLDUxMiwyNjcuMzE5LDUxMiwyNTZDNTEyLDI0NC42ODMsNTExLjI1NiwyMzMuNTM5LDUwOS44MzMsMjIyLjYwOXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNEODAwMjc7IiBkPSJNMzIyLjc4MywzMjIuNzg0TDMyMi43ODMsMzIyLjc4NEw0MzcuMDE5LDQzNy4wMmM1LjI1NC01LjI1MiwxMC4yNjYtMTAuNzQzLDE1LjA0OC0xNi40MzUgICBsLTk3LjgwMi05Ny44MDJoLTMxLjQ4MlYzMjIuNzg0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Q4MDAyNzsiIGQ9Ik0xODkuMjE3LDMyMi43ODRoLTAuMDAyTDc0Ljk4LDQzNy4wMTljNS4yNTIsNS4yNTQsMTAuNzQzLDEwLjI2NiwxNi40MzUsMTUuMDQ4bDk3LjgwMi05Ny44MDQgICBWMzIyLjc4NHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNEODAwMjc7IiBkPSJNMTg5LjIxNywxODkuMjE5di0wLjAwMkw3NC45ODEsNzQuOThjLTUuMjU0LDUuMjUyLTEwLjI2NiwxMC43NDMtMTUuMDQ4LDE2LjQzNWw5Ny44MDMsOTcuODAzICAgSDE4OS4yMTd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRDgwMDI3OyIgZD0iTTMyMi43ODMsMTg5LjIxOUwzMjIuNzgzLDE4OS4yMTlMNDM3LjAyLDc0Ljk4MWMtNS4yNTItNS4yNTQtMTAuNzQzLTEwLjI2Ni0xNi40MzUtMTUuMDQ3ICAgbC05Ny44MDIsOTcuODAzVjE4OS4yMTl6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
            alt="English"
          />
          English
        </a>
      </div>
    </li>
  );
}
