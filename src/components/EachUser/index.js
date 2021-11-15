import { MdDelete } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import './index.css'
const EachUser = props => {
  const { details, deleteUserFromList, setEditingRowId } = props
  const { id, name, email, role, isChecked } = details

  const deleteUser = () => {
    deleteUserFromList(id)
  }

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          id={id}
          onChange={props.handleCheck}
          checked={isChecked}
        />
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>
        <div className="icons-section" >
          <AiFillEdit className="edit-icon" onClick={(event) => setEditingRowId(event, details)} />
          <MdDelete onClick={deleteUser} className="delete-icon" />
        </div>
      </td>
    </tr>
  )
}
console.log = console.warn = console.error = () => {};
export default EachUser
