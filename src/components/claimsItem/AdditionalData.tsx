import { useState } from 'react'
import { IItem } from '../../store/data-store/types.ts'
import { formatPhoneNumber, regExpSortTel, replaceSpecialSymbols } from '../../utils/replacelSymbols.ts'
import { useDataStore } from '../../store/data-store/data-store.ts'

export const AdditionalData = (props: IItem) => {const {
  description,
  additional_data,
  customer
} = props

  const [openDetail, setOpenDetail] = useState(false)
  const [entranceFloor, setEntranceFloor] = useState([])
  const showEntranceFloor = useDataStore(state => state.showEntranceFloor);


  const setDetailData = () => {
    setOpenDetail(prevState => !prevState)
    if(customer?.id && !openDetail) {
      showEntranceFloor(customer?.id)
        .then( data => {
        setEntranceFloor(data)
      })

    }
  }

  return (
    <>
    {additional_data && <div className="d-flex flex-column w-100">
      <hr className="w-75" />
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-sm p-2 btn-outline box-shadow mb-3 box-shadow bg-success text-light"
          onClick={setDetailData}
        >
          {openDetail ? 'Скрыть' : 'Подробнее...'}
        </button>
        {
          entranceFloor[0]?.entrance &&
          <div className="d-flex align-items-center mb-3">
            <span>
              <strong> Подъезд / этаж: </strong>
              {entranceFloor[0]?.entrance}
              {' '}/{' '}
              {entranceFloor[0]?.floor}
            </span>
          </div>
        }

      </div>

      <div className="d-flex align-self-start flex-column world-break">

        {openDetail && additional_data && Object.values(additional_data)
          .flat()
          .map(item =>
            <div key={item.id} className="mb-2">
              <strong>{replaceSpecialSymbols(item?.caption)}&nbsp;
              </strong>{replaceSpecialSymbols(item?.value)}</div>)}

        <div className="d-flex align-self-start flex-wrap gap-3">
          {Object.values(additional_data).map(item =>
            item?.value.match(regExpSortTel) ?
              <a
                key={item.id}
                href={`tel:${formatPhoneNumber(item?.value)}`}
              >
                {formatPhoneNumber(item?.value)}
              </a>
              : ''
          )}

          {description?.match(regExpSortTel) &&
            <div className="flex justify-content-center align-items-center mb-2">
              <a href={`tel:${formatPhoneNumber(description)}`}>
                {formatPhoneNumber(description)}
              </a>
            </div>}
        </div>
      </div>
    </div>}
    </>
  )
}
