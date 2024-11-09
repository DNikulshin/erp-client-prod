import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moment from 'moment/moment'
import { useDataStore } from '../store/data-store/data-store.ts'
import Select from 'react-select'
import { Clockwise } from '../iconsSvg/Clockwise'
import { House } from '../iconsSvg/House.tsx'
import { PersonBoundingBox } from '../iconsSvg/PersonBoundingBox.tsx'
import { Wrench } from '../iconsSvg/Wrench.tsx'
import { Search } from '../iconsSvg/Search.tsx'
import { Power } from '../iconsSvg/Power.tsx'

interface navigationProps {
    logout: () => void
}
export interface IOptions {
    label?: string
    value?: {
        dateDoFrom?: number | string | undefined
        dateDoTo?: number | string | undefined
        typeRequest?: string
        stateId?: number
    }
}

const options: IOptions[] = [
    {
        label: 'Мои заявки сегодня',
        value: {
            dateDoFrom: moment().format('DD.MM.YYYY'),
            dateDoTo: moment().format('DD.MM.YYYY'),
            typeRequest: 'employee',
        },
    },
    {
        label: 'Заявки подраздел. сегодня',
        value: {
            dateDoFrom: moment().format('DD.MM.YYYY'),
            dateDoTo: moment().format('DD.MM.YYYY'),
            typeRequest: 'division',
        },
    },
    {
        label: 'Заявки подраздел. завтра',
        value: {
            dateDoFrom: moment().add(1, 'days').format('DD.MM.YYYY'),
            dateDoTo: moment().add(1, 'days').format('DD.MM.YYYY'),
            typeRequest: 'division',
        },
    },
    {
        label: 'Заявки подраздел. вчера',
        value: {
            dateDoFrom: moment().subtract(1, 'days').format('DD.MM.YYYY'),
            dateDoTo: moment().subtract(1, 'days').format('DD.MM.YYYY'),
            typeRequest: 'division',
        },
    },
    {
        label: 'Заявки подраздел. в этом месяце',
        value: {
            dateDoFrom: moment().startOf('month').format('DD.MM.YYYY'),
            dateDoTo: moment().endOf('month').format('DD.MM.YYYY'),
            typeRequest: 'division',
        },
    },
]

export const Navigation = ({ logout }: navigationProps) => {
    const [position, setPosition] = useState(window?.scrollY)
    const [visible, setVisible] = useState(true)
    const [selectedOption, setSelectedOption] = useState<IOptions>(options[0])
    const getItems = useDataStore((state) => state.getItems)
    const location = useLocation()

    useEffect(() => {
        if (selectedOption.value) {
            getItems({
                dateDoTo: selectedOption?.value?.dateDoTo,
                dateDoFrom: selectedOption?.value?.dateDoFrom,
                typeRequest: selectedOption?.value?.typeRequest,
            })
        }
    }, [getItems, selectedOption])

    useEffect(() => {
        const handleScroll = () => {
            const moving = window?.scrollY

            setVisible(position > moving)
            setPosition(moving)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    const cls = visible ? 'visible-header' : 'hidden-header'

    return (
        <>
            <header
                className={
                    'd-flex flex-column justify-content-around align-items-center bg-secondary bg-opacity-75 flex-nowrap rounded position-sticky w-100 top-0 p-3 mb-2 flex-shrink-0' +
                    ' ' +
                    cls
                }
                style={{
                    zIndex: 9999,
                }}
            >
                <div className="d-flex mb-3 justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-center gap-4 justify-content-center mx-auto">
                        {location.pathname === '/' ? (
                            <button
                                className="d-flex align-items-center btn btn-sm text-bg-primary text-light box-shadow_svg"
                                onClick={() =>
                                    getItems({
                                        dateDoTo: selectedOption?.value?.dateDoTo,
                                        dateDoFrom: selectedOption?.value?.dateDoFrom,
                                        typeRequest: selectedOption?.value?.typeRequest,
                                    })
                                }
                            >
                                <Clockwise />
                            </button>
                        ) : (
                            <button
                                className="d-flex btn btn-sm text-bg-primary text-light box-shadow_svg"
                                onClick={() => window?.location?.reload()}
                            >
                                <Clockwise />
                            </button>
                        )}
                        <NavLink to="/" className="d-flex btn btn-sm text-bg-light text-secondary box-shadow_svg">
                            <House />
                        </NavLink>
                        <NavLink to="/user" className="d-flex btn btn-sm text-bg-light text-secondary box-shadow_svg">
                            <PersonBoundingBox />
                        </NavLink>
                        <NavLink
                            className="d-flex btn btn-sm text-bg-light text-secondary box-shadow_svg"
                            to="/test"
                            title="test"
                        >
                            <Wrench />
                        </NavLink>
                        <NavLink
                            className="d-flex btn btn-sm text-bg-light text-secondary box-shadow_svg"
                            to="/info"
                            title="info"
                        >
                            <Search />
                        </NavLink>
                    </div>

                    <div className="logout">
                        <Link
                            className="d-flex btn btn-sm text-bg-danger text-light box-shadow_svg"
                            to="/login"
                            title="Выйти"
                            onClick={logout}
                        >
                            <Power />
                        </Link>
                    </div>
                </div>

                {location.pathname === '/' && (
                    <Select
                        defaultValue={selectedOption}
                        onChange={(newValue) => setSelectedOption(newValue ?? {})}
                        options={options}
                        className="d=flex w-100 bg-dark-subtle"
                        autoFocus={false}
                        isSearchable={false}
                    />
                )}
            </header>
        </>
    )
}
