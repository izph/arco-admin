// 引入axios和定义在node_modules/axios/index.ts文件里的类型声明
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';


const baseUrl = {
    devApiBaseUrl: '/test/api/xxx',
    proApiBaseUrl: '/api/xxx',

};

const apiBaseUrl = process.env.NODE_ENV === 'production' ? baseUrl.proApiBaseUrl : baseUrl.devApiBaseUrl;


export interface ResponseData {
    code: number
    data?: any
    msg: string
}


// 定义接口请求类，用于创建axios请求实例
class HttpRequest {
    // 接收接口请求的基本路径
    constructor(public baseUrl: string = apiBaseUrl) {
        this.baseUrl = baseUrl;
    }

    // 调用接口时调用实例的这个方法，返回AxiosPromise
    public request(options: AxiosRequestConfig): AxiosPromise {
        // 创建axios实例，它是函数，同时这个函数包含多个属性
        const instance: AxiosInstance = axios.create()
        // 合并基础路径和每个接口单独传入的配置，比如url、参数等
        options = this.mergeConfig(options)
        // 调用interceptors方法使拦截器生效
        this.interceptors(instance, options.url)
        // 返回AxiosPromise
        return instance(options)
    }

    // 用于添加全局请求和响应拦截
    private interceptors(instance: AxiosInstance, url?: string) {
        // 请求拦截
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            // 接口请求的所有配置，可以在axios.defaults修改配置

        }, (error) => {
            return Promise.reject(error); // 捕获错误信息
        })
        // 响应拦截
        instance.interceptors.response.use((res: AxiosResponse) => {
            // const { data } = res
            // const { code, msg } = data
            // if (code !== 0) {
            //     console.error(msg)
            // }
            return res;
        }, (error) => {
            return Promise.reject(error)
            // if (err.response.status === 403) {
            //     // 统一处理未授权请求，跳转到登录界面
            //     document.location = '/login';
            // }
            // return Promise.reject(err);
        })
    }

    // 用于合并基础路径配置和接口单独配置
    private mergeConfig(options: AxiosRequestConfig): AxiosRequestConfig {
        return Object.assign({ baseURL: this.baseUrl }, options);
    }
}
export default new HttpRequest();
