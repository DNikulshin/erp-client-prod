import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Base64 } from 'js-base64'

export const TestPage = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isAuth, setIsAuth] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [mac, setMac] = useState('')
    const [cableDiag, setCableDiag] = useState('')
    const [portStatus, SetPortStatus] = useState('')
    const [linkStatus, setLinkStatus] = useState('')

    const login = async () => {
        try {
            setError('')
            setSuccess('')

            if (!userName || !password) return

            const encodedAuth = Base64.encode(`${userName}:${password}`)

            const response = await axios('/api', {
                headers: {
                    Authorization: `Basic ${encodedAuth}`,
                },
            })

            if(response.status === 302 || response.status === 200) {
                setIsAuth(true)
                localStorage.setItem('cookie-test', document.cookie)
                setSuccess(`Request ok, status: ${response.status}`)
            }



        } catch (e) {
            if (e instanceof AxiosError) {
                setIsAuth(false)
                setError(`Request failed, status: ${e.status}`)
                console.log(e)
            }
            setIsAuth(false)
            throw e
        }
    }

    const searchByIp = async () => {
        try {
            setData([])
            setMac('')
            setCableDiag('')

            const response = await axios('/api', {
                params: {
                    plugin: 'ips',
                    mode: 'list_ips',
                    'search[value]': search
                }
            })

            setData(response.data.data)

           const swId = response.data.data[0]['sw_id']
            const port = response.data.data[0]['port']

            const response2 = await axios('/api', {
                params: {
                    plugin: 'switches',
                    mode: 'get_ports',
                    sw_id: swId
                }
            })

            const swPortId = response2.data.data[+port -1]['swport_id']

            SetPortStatus(response2.data.data[+port -1]['nway_status'])
            setLinkStatus(response2.data.data[+port -1]['link_status'])

            const response3 = await axios('/api', {
                params: {
                    plugin: 'switches',
                    mode: 'list_fdb_port',
                    sw_id: swId,
                    swport_id: swPortId
                }
            })

            setMac(response3.data.replace(/(\<(\/?[^>]+)>)/g, '').replace(/&nbsp;/g, ' '))

            const response4 = await axios('/api', {
                params: {
                    plugin: 'switches',
                    mode: 'cable_diag_port',
                    sw_id: swId,
                    swport_id: swPortId
                }
            })
            setCableDiag(response4.data)

        } catch (e) {
            if (e instanceof AxiosError) {
                setIsAuth(false)
                setError(`Request failed, status: ${e.status}`)
                console.log(e)
            }
            setIsAuth(false)
            throw e
        }
        }

useEffect(() => {
    if(localStorage.getItem('cookie-test') === document.cookie) {
        setIsAuth(true)
    }
}, [isAuth] )

    return (
        <div className="d-flex flex-column gap-3 text-center">
            <h3>Testing Page</h3>

            <div className={`text-${error ? 'danger' : 'success'}`}>{error ? error : success}</div>

            {!isAuth && <div className='d-flex gap-2 flex-column justify-content-center align-items-center'>
                <input type='text' placeholder='Логин' value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input
                  type='text'
                  placeholder='Пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className='btn btn-sm btn-primary' onClick={login}>
                    Войти
                </button>
            </div>}

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

            <div>
                {data && data.map(el =>
                  <div key={el?.ip_address}>
                      <p>location_name: {el?.location_name}</p>
                      {el?.dyn_ip && <p>dyn_ip: {el?.dyn_ip}</p>}
                      <p>ip_address: {el?.ip_address}</p>
                      <p>switch_ip: {el?.switch_ip}</p>
                      {/*<p>sw_id: {el?.sw_id}</p>*/}
                      <p>port: {el?.port}</p>
                      <p>{linkStatus}</p>
                      <p>{portStatus}</p>


                      <p>{mac}</p>
                      <p>{cableDiag}</p>
                  </div>
                )}
            </div>
        </div>
    )
}
