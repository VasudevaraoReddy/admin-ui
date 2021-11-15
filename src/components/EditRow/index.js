import { MdCancel } from 'react-icons/md'
import './index.css'
const EditRow = props => {
    const { editFormData, onChangeEditInput , onClickCancel} = props
    const { name, email, role } = editFormData
    return (
        <tr>
            <td></td>
            <td>
                <input className="edit-row" type="text" name="name" value={name} onChange={onChangeEditInput} />
            </td>
            <td>
                <input type="text" className="edit-row" name="email" value={email} onChange={onChangeEditInput} />
            </td>
            <td>
                <input type="text" className="edit-row" name="role" value={role} onChange={onChangeEditInput} />
            </td>
            <td>
                <div className="icons-section ">
                    <button type="submit" className="btn">Save</button>
                    <MdCancel className="cancel-icon" onClick={onClickCancel}/>
                </div>
            </td>
        </tr>
    )
}
export default EditRow