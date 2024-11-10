import { IEmployee } from '../../../store/user-store/user-store.ts';
import { AllowStaffIcon } from './AllowStaffIcon.tsx'
interface AllowStaffProps {
  staffNames: IEmployee[]
  id: number
}
export const AllowStaff = ({ staffNames, id }: AllowStaffProps) => {

  return (
    <>
      {<div
        className="gap-2 mt-2" tabIndex={0}
      style={{
        display: "grid",
        gridTemplateColumns: '1fr 1fr'
      }}>
        {staffNames && staffNames.sort((a, b) => {
          if (a.name?.toLowerCase() < b.name?.toLowerCase()) {
            return -1
          }
          if (a.name?.toLowerCase() > b.name?.toLowerCase()) {
            return 1
          }
          return 0
        })
          .map(item =>
          <div key={item.id}
               className="d-flex align-items-center"
          >
            <AllowStaffIcon id={id} itemId={item.id}/>
            <small
            >
              {item.name}
            </small>
          </div>
        )
        }
      </div>
      }
    </>
  )
}
