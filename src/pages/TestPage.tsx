import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { Base64 } from 'js-base64'

export const TestPage = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isAuth, setIsAuth] = useState(false)
    const [error, setError] = useState('')
    const [succses, setSuccess] = useState('')
    const [search, setSearch] = useState('')

    const login = async () => {
        try {
            setError('')
            setSuccess('')

            if (!userName || !password) return

            const encodedAuth = Base64.encode(`${userName}:${password}`)

            const response = await axios('/testapi', {
                headers: {
                    Authorization: `Basic ${encodedAuth}`,
                },
            })

            console.log(encodedAuth)

            if (response.status === 200) {
                setIsAuth(true)
                setSuccess(`Request ok, status: ${response.status}`)
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                const encodedAuth = Base64.encode(`${userName}:${password}`)
                console.log(encodedAuth)
                setIsAuth(false)
                setError(`Request failed, status: ${e.status}`)
                console.log(e)
            }
            setIsAuth(false)
            throw e
        }
    }

    const searchByIp = async () => {
        const encodedAuth = Base64.encode(`${userName}:${password}`)
        const response = await axios('/api', {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
            params: {
                plugin: 'ips',
                mode: 'get_ports',
                'seach[value]': search, //46.44.24.51
            },
        })

        console.log(response)
    }

    return (
        <div className="d-flex flex-column gap-3 text-center">
            <h3>Testing Page</h3>

            <div className={`text-${error ? 'danger' : 'success'}`}>{error ? error : succses}</div>

            <div className="d-flex gap-2 flex-column justify-content-center align-items-center">
                <input type="text" placeholder="Логин" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input
                    type="text"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-sm btn-primary" onClick={login}>
                    Войти
                </button>
            </div>

            {isAuth && (
                <div className="d-flex gap-2 justify-content-center">
                    <input
                        type="text"
                        placeholder="Ведите ip устройства..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-sm btn-primary" onClick={searchByIp}>
                        Найти
                    </button>
                </div>
            )}
        </div>
    )
}
