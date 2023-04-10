import axios from './instance'

import type { AxiosResponse } from 'axios'

const axiosAPI = {
    get<T>(url: string, params: any): Promise<T> {
        return new Promise((resolve, reject) => {
            axios.get(url, { params }).then((res: AxiosResponse<T>) => resolve(res.data)).catch(e => reject(e));
        })
    },
    post<T>(url: string, params: any): Promise<T> {
        return new Promise((resolve, reject) => {
            axios.post(url, params).then((res: AxiosResponse<T>) => resolve(res.data)).catch(e => reject(e));
        })
    },
}

export default axiosAPI