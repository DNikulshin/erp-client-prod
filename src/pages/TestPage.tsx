import axios, { AxiosError } from 'axios'
import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react'
import { Base64 } from 'js-base64'
import { ITestItem, TestItem } from '../components/test/TestItem.tsx'
import { validateIp } from '../utils/validateIp.ts'
import { Loader } from '../components/Loader.tsx'
// import { instanceAxiosTestApi } from '../axios.ts'

interface IFormSearch {
  search: string
}

interface IFormLogin {
  username: string
  password: string
}


export const TestPage = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formLogin, setFormLogin] = useState<IFormLogin>({ username: '', password: '' })
  const [formSearch, setFormSearch] = useState<IFormSearch>({ search: '' })
  const [data, setData] = useState<ITestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [isValid, setIsValid] = useState(true)


  const changeHandlerLogin: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    })

  }

  const changeHandlerSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormSearch({
      ...formSearch,
      [e.target.name]: e.target.value,
    })

  }


  const submitHandlerLogin = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setError('')
      setSuccess('')

      if (!formLogin.username || !formLogin.password) return

      const encodedAuth = Base64.encode(`${formLogin.username}:${formLogin.password}`)

      const response = await axios('/api', {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
        },
      })

      if (response.status === 302 || response.status === 200) {
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

  const submitHandlerSearch = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()

      if(validateIp(formSearch.search)) {
        setIsValid(true)
      } else {
        setIsValid(false)
        return false
      }

      setLoading(true)
      setData([])

      const response = await axios('/api', {
        params: {
          plugin: 'ips',
          mode: 'list_ips',
          'search[value]': formSearch.search.trim(),
        },
      })

      setData(response.data.data)

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
    if (localStorage.getItem('cookie-test') === document.cookie) {
      setIsAuth(true)
    } else {
      localStorage.removeItem('cookie-test')
      setIsAuth(false)
    }
    setLoadingPage(false)

  }, [])


  if(loadingPage) {
    return null
  }


  return (
    <div className='d-flex flex-column gap-3 text-center'>
      <h3>Testing Page</h3>

      <div className={`text-${error ? 'danger' : 'success'}`}>{error ? error : success}</div>

      {!isAuth &&
        <form className='d-flex gap-2 flex-column justify-content-center align-items-center'
              onSubmit={submitHandlerLogin}
        >
          <input
            className="p-2"
            type='text'
                 name='username'
                 placeholder='Логин'
                 value={formLogin.username}
                 onChange={changeHandlerLogin} />
          <input
            className="p-2"
            type='text'
            name='password'
            placeholder='Пароль'
            value={formLogin.password}
            onChange={changeHandlerLogin}
          />
          <button type='submit' className='btn btn-sm btn-primary'>
            Войти
          </button>
        </form>}

      {isAuth && (
        <form className='d-flex gap-2 justify-content-center'
              onSubmit={submitHandlerSearch}
        >
          <div className='d-flex flex-column gap-2'

          >
            {(!isValid && formSearch.search) && <span className='text-danger'>Некорректый ip</span>}
            <input
              className="p-1"
              type='text'
              name='search'
              placeholder='Введите ip...'
              onChange={changeHandlerSearch}
              value={formSearch.search}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-sm btn-success align-self-end p-2 box-shadow_svg'
          >
            Search
          </button>
        </form>
      )}

      {!loading ? <div>
          {data?.length > 0 && <div className='mb-1'>Count: <strong className='text-success'>{data?.length}</strong></div>}
          {data && data.map(el =>
            <div key={el?.ip_address}>
              <TestItem
                ip_address={el?.ip_address ?? ''}
                location_name={el?.location_name ?? ''}
                switch_ip={el?.switch_ip ?? ''}
                dyn_ip={el?.dyn_ip ?? ''}
                sw_id={el?.sw_id ?? ''}
                port={el?.port ?? ''}
              />,
            </div>

          )}
        </div>
        :
        <div>Loading...</div>
      }
    </div>
  )
}
