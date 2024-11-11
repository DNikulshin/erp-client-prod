import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

export interface ITestItem {
  ip_address: string
  location_name: string
  dyn_ip?: string
  switch_ip: string
  sw_id: string
  port: string

}

export const TestItem = (
  {
    location_name,
    switch_ip,
    dyn_ip,
    ip_address,
    sw_id,
    port,
  }: ITestItem,
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mac, setMac] = useState('')
  const [cableDiag, setCableDiag] = useState('')
  const [portStatus, SetPortStatus] = useState('')
  //const [linkStatus, setLinkStatus] = useState('')
  const [billingAccountId, setBillingAccountId] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [swPortId, setSwPortId] = useState('')

  const getData = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await axios('/api', {
        params: {
          plugin: 'switches',
          mode: 'get_ports',
          sw_id,
        },
      })

      setSwPortId(response.data.data[+port - 1]['swport_id'])
      SetPortStatus(response.data.data[+port - 1]['nway_status'])
      //setLinkStatus(response.data.data[+port - 1]['link_status'])
      setBillingAccountId(response.data.data[+port - 1]['billing_account_id'])
      setBillingAddress(response.data.data[+port - 1]['billing_address'])

    } catch (e) {
      if (e instanceof AxiosError) {
        setLoading(false)
        setError(`Request failed, status: ${e.status}`)
        console.log(e)
      }
      setLoading(false)
      throw e

    } finally {
      setLoading(false)
    }
  }

  const testCableDiag = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await axios('/api', {
        params: {
          plugin: 'switches',
          mode: 'list_fdb_port',
          sw_id,
          swport_id: swPortId,
        },
      })

      setMac(response.data.replace(/(\<(\/?[^>]+)>)/g, '').replace(/&nbsp;/g, ' '))

      const response2 = await axios('/api', {
        params: {
          plugin: 'switches',
          mode: 'cable_diag_port',
          sw_id,
          swport_id: swPortId,
        },
      })
      setCableDiag(response2.data)
      setLoading(false)
    } catch (e) {
      if (e instanceof AxiosError) {
        setLoading(false)
        setError(`Request failed, status: ${e.status}`)
        console.log(e)
      }
      setLoading(false)
      throw e

    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div className='d-flex flex-column gap-2 p-2 box-shadow'>
        {/*<hr />*/}
        <div className={`text-${error ? 'danger' : 'success'}`}>{error ? error : success}</div>
        <div>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor'
               className='bi bi-building-fill' viewBox='0 0 16 16'>
            <path
              d='M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5' />
          </svg>
          {' '}
          location_name: {location_name}
        </div>
        <div>billing_account_id: {billingAccountId}</div>
        <div>billing_address: {billingAddress}</div>
        {dyn_ip && <div>dyn_ip: {dyn_ip}</div>}
        <div>ip_address: {ip_address}</div>
        <div>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor'
               className='bi bi-hdd-network' viewBox='0 0 16 16'>
            <path d='M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0' />
            <path
              d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5' />
          </svg>
          {' '}
          switch_ip: {switch_ip}
        </div>
        {/*<p>sw_id: {el?.sw_id}</p>*/}

        <div className='d-flex gap-2 justify-content-center align-items-center'>
          {/*<div>{portStatus}</div>*/}
          <div className={portStatus === 'Link Down' ? 'text-danger' : 'text-success'}>{portStatus}</div>
          <div> <strong>port:</strong> <strong className="text-success">{port}</strong></div>
          {/*<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='currentColor'*/}
          {/*     className='bi bi-ethernet' viewBox='0 0 16 16'>*/}
          {/*  <path*/}
          {/*    d='M14 13.5v-7a.5.5 0 0 0-.5-.5H12V4.5a.5.5 0 0 0-.5-.5h-1v-.5A.5.5 0 0 0 10 3H6a.5.5 0 0 0-.5.5V4h-1a.5.5 0 0 0-.5.5V6H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5M3.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m2 0h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zM9.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25z' />*/}
          {/*  <path*/}
          {/*    d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z' />*/}
          {/*</svg>*/}

          {' '}
          <button
            className='btn btn text-bg-primary mx-2 box-shadow_svg'
            disabled={loading}
                  onClick={testCableDiag}
          >
            test
          </button>
        </div>
        {!loading ? <div>
          <div>{mac}</div>
          <div>{cableDiag}</div>
        </div>
          :
          <div>Loading...</div>
        }
      </div>
    </>
  )
}
