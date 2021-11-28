import request from '@/utils/request'
import http from '@/utils/http'
import {getUserId} from '@/utils/auth'
//获取用户列表
export async function getUserListApi(parm){
  return await http.get("/api/user/list",parm)
}
//新增员工
export async function addUserApi(parm){
  return await http.post("/api/user",parm)
}

//编辑员工
export async function editUserApi(parm){
  return await http.put("/api/user",parm)
}
//删除员工
export async function deleteUserApi(parm){
  return await http.delete(parm)
}

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }
//员工登录
export async function login(parm){
  debugger;
  return await http.post("/api/user/login",parm)
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//获取用户信息
export async function getInfo(){
  debugger;
  let parm = {
    userId:getUserId()
  }
  return await http.get("/api/user/getInfo",parm)
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
