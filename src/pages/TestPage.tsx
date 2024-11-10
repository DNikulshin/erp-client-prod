import axios, { AxiosError } from 'axios'
import { ChangeEventHandler, FormEvent, FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Base64 } from 'js-base64'
import { s } from 'vite/dist/node/types.d-aGj9QkWt'

interface IFormSearch {

    search: string
}

export const TestPage = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isAuth, setIsAuth] = useState(false)
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    //const [formValue, setFormValue] = useState<IFormSearch>({ search: '' })
    const [data, setData] = useState([])
    const [mac, setMac] = useState('')
    const [cableDiag, setCableDiag] = useState('')
    const [portStatus, SetPortStatus] = useState('')
    const [linkStatus, setLinkStatus] = useState('')
    const [billingAccountId, setBillingAccountId] = useState('')
    const [billingAddress, setBillingAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(true);


    const validateIp = (ip) =>
    { const ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipFormat.test(ip);
    };

    const handleChange = (event) =>
    {
        setSearch(event.target.value)
    }

    // const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    //     try {
    //         e.preventDefault()
    //
    //         const formData = new FormData()
    //         formData.append('search', formValue.search.trim())
    //         setIsValid(validateIP(formValue.search))
    //         if (!formValue.search || !isValid) return
    //         setLoading(true)
    //         setData([])
    //         setMac('')
    //         setCableDiag('')
    //         const response = await axios('/api', {
    //             params: {
    //                 plugin: 'ips',
    //                 mode: 'list_ips',
    //                 'search[value]': formValue.search
    //             }
    //         })
    //
    //         setData(response.data.data)
    //
    //         const swId = response.data.data[0]['sw_id']
    //         const port = response.data.data[0]['port']
    //
    //         const response2 = await axios('/api', {
    //             params: {
    //                 plugin: 'switches',
    //                 mode: 'get_ports',
    //                 sw_id: swId
    //             }
    //         })
    //
    //         const swPortId = response2.data.data[+port -1]['swport_id']
    //
    //         SetPortStatus(response2.data.data[+port -1]['nway_status'])
    //         setLinkStatus(response2.data.data[+port -1]['link_status'])
    //         setBillingAccountId(response2.data.data[+port -1]['billing_account_id'])
    //         setBillingAddress(response2.data.data[+port -1]['billing_address'])
    //
    //         const response3 = await axios('/api', {
    //             params: {
    //                 plugin: 'switches',
    //                 mode: 'list_fdb_port',
    //                 sw_id: swId,
    //                 swport_id: swPortId
    //             }
    //         })
    //
    //         setMac(response3.data.replace(/(\<(\/?[^>]+)>)/g, '').replace(/&nbsp;/g, ' '))
    //
    //         const response4 = await axios('/api', {
    //             params: {
    //                 plugin: 'switches',
    //                 mode: 'cable_diag_port',
    //                 sw_id: swId,
    //                 swport_id: swPortId
    //             }
    //         })
    //         setCableDiag(response4.data)
    //         setLoading(false)
    //
    //
    //     } catch (e) {
    //         if (e instanceof AxiosError) {
    //             setLoading(false)
    //             setIsAuth(false)
    //             setError(`Request failed, status: ${e.status}`)
    //             console.log(e)
    //         }
    //         setLoading(false)
    //         setIsAuth(false)
    //         throw e
    //     } finally {
    //         setLoading(false)
    //
    //     }
    //
    //
    // }, [formValue]);

    // const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    //     setFormValue({
    //         ...formValue,
    //         [e.target.name]: e.target.value,
    //     });
    //
    // };

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

    const searchByIp  = useCallback(async () => {
        try {
            setIsValid(validateIp(search))
            if(!isValid || !search) return
            setLoading(true)
            setIsValid(true)
            setData([])
            setMac('')
            setCableDiag('')

            const response = await axios('/api', {
                params: {
                    plugin: 'ips',
                    mode: 'list_ips',
                    'search[value]': search.trim()
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
            setBillingAccountId(response2.data.data[+port -1]['billing_account_id'])
            setBillingAddress(response2.data.data[+port -1]['billing_address'])

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
            setLoading(false)

        } catch (e) {
            if (e instanceof AxiosError) {
                setLoading(false)
                setIsAuth(false)
                setError(`Request failed, status: ${e.status}`)
                console.log(e)
            }
            setLoading(false)
            setIsAuth(false)
            throw e
        } finally {
            setLoading(false)
        }
        }, [search, isValid])

useEffect(() => {
    if(localStorage.getItem('cookie-test') === document.cookie) {
        setIsAuth(true)
    }
}, [isAuth] )

    return (
        <div className="d-flex flex-column gap-3 text-center">
            <h3>Testing Page</h3>

            <div className={`text-${error ? 'danger' : 'success'}`}>{error ? error : success}</div>

            {!isAuth &&
              <div className='d-flex gap-2 flex-column justify-content-center align-items-center'>
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
                <div className="d-flex gap-2 justify-content-center"
                >
                    <div className="d-flex flex-column gap-2">
                        {(!isValid)&& <span className="text-danger">Некорректый ip</span>}
                        <input
                          type="text"
                          placeholder="Ведите ip..."
                          onChange={handleChange}
                          value={search}
                          autoComplete="on"
                        />
                    </div>

                    <button type="button" disabled={loading} className="btn btn-sm btn-primary align-self-end"
                            onClick={searchByIp}
                    >
                        test
                    </button>
                </div>
            )}

            {!loading ? <div>
                {data && data.map(el =>
                  <div key={el?.ip_address}>
                      <p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-building-fill" viewBox="0 0 16 16">
                              <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5"/>
                          </svg>
                          {' '}
                          location_name: {el?.location_name}
                      </p>
                      <p>billing_account_id: {billingAccountId}</p>
                      <p>billing_address: {billingAddress}</p>
                      {el?.dyn_ip && <p>dyn_ip: {el?.dyn_ip}</p>}
                      <p>ip_address: {el?.ip_address}</p>
                      <p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-hdd-network" viewBox="0 0 16 16">
                          <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/>
                      </svg>
                          {' '}
                         switch_ip: {el?.switch_ip}
                      </p>
                      {/*<p>sw_id: {el?.sw_id}</p>*/}
                      <p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-ethernet" viewBox="0 0 16 16">
                          <path d="M14 13.5v-7a.5.5 0 0 0-.5-.5H12V4.5a.5.5 0 0 0-.5-.5h-1v-.5A.5.5 0 0 0 10 3H6a.5.5 0 0 0-.5.5V4h-1a.5.5 0 0 0-.5.5V6H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5M3.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m2 0h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zM9.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25z"/>
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                      </svg>
                          {' '}
                          port: {el?.port}
                      </p>
                      <p className={linkStatus === 'Link Up' ? 'text-success': 'text-danger'}>{linkStatus}</p>
                      <p>{portStatus}</p>


                      <p>{mac}</p>
                      <p>{cableDiag}</p>
                  </div>,
                )}
            </div>
              :
              <div>Loading...</div>
            }
        </div>
    )
}
