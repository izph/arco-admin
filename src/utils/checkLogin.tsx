// 用户是否处于登录状态
export default function checkLogin() {
  return localStorage.getItem('userStatus') === 'login';
}
