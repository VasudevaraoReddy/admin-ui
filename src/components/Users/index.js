import { Component } from 'react'
import Loader from 'react-loader-spinner'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import EachUser from '../EachUser'
import EditRow from '../EditRow'
import PaginationRender from '../PaginationRender'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const pages = [
  {
    id: 0,
    pageId: 1,
    from: 0,
    to: 10,
  },
  {
    id: 1,
    pageId: 2,
    from: 10,
    to: 20,
  },

  {
    id: 2,
    pageId: 3,
    from: 20,
    to: 30,
  },

  {
    id: 3,
    pageId: 4,
    from: 30,
    to: 40,
  },

  {
    id: 4,
    pageId: 5,
    from: 40,
    to: 48,
  },
]

class Users extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    originalList: [],
    usersList: [],
    activePage: pages[0].id,
    searchInput: '',
    editingRowId: '',
    editFormData: {
      name: '',
      email: '',
      role: '',
    }
  }

  componentDidMount() {
    this.callUsersApi()
  }

  callUsersApi = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress })
    const url =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    const response = await fetch(url)
    if (response.ok === true) {
      const { activePage } = this.state
      const data = await response.json()
      const updatedUsersList = data.map(eachUser => ({
        id: eachUser.id,
        email: eachUser.email,
        name: eachUser.name,
        role: eachUser.role,
        isChecked: false,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        usersList: updatedUsersList.slice(
          pages[activePage].from,
          pages[activePage].to,
        ),
      })
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure })
    }
  }

  deleteUserFromList = id => {
    const { usersList } = this.state
    const filteredUsersData = usersList.filter(each => each.id !== id)
    this.setState({
      usersList: filteredUsersData,
    })
  }

  handleCheck = event => {
    const { usersList } = this.state
    usersList.forEach(each => {
      if (each.id === event.target.id) {
        each.isChecked = event.target.checked
      }
    })
    this.setState({ usersList: usersList })
  }

  deleteSelectedUsers = () => {
    const { usersList } = this.state
    const filtered = usersList.filter(each => each.isChecked !== true)
    this.setState({ usersList: filtered })
  }

  onDecrement = () => {
    const { activePage } = this.state
    if (activePage !== 0) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.callUsersApi,
      )
    }
  }

  onIncrement = () => {
    const { activePage } = this.state
    if (activePage >= 0 && activePage < 4) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.callUsersApi,
      )
    }
  }

  setPage = id => {
    this.setState({ activePage: id }, this.callUsersApi)
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  handleAllChecked = event => {
    const { usersList } = this.state
    usersList.forEach(each => (each.isChecked = event.target.checked))
    this.setState({ usersList: usersList })
  }

  setEditingRowId = (event, details) => {
    event.preventDefault()
    const formValues = {
      name: details.name,
      email: details.email,
      role: details.role,
    }
    this.setState({ editingRowId: details.id, editFormData: formValues })
  }

  onChangeEditInput = (event) => {
    const { editFormData } = this.state
    event.preventDefault()
    const fieldName = event.target.getAttribute("name");
    const fielValue = event.target.value;
    const newFormData = { ...editFormData }
    newFormData[fieldName] = fielValue
    this.setState({ editFormData: newFormData })
  }

  onSubmitEditedData = (event) => {
    const { editFormData, editingRowId, usersList } = this.state
    event.preventDefault()
    const editedUserData = {
      id: editingRowId,
      name: editFormData.name,
      email: editFormData.email,
      role: editFormData.role,
    }
    const index = usersList.findIndex((eachUser) => eachUser.id === editingRowId)
    const newUsersList = [...usersList]
    newUsersList[index] = editedUserData
    this.setState({ usersList: newUsersList, editingRowId: '' })

  }

  onClickCancel = () => {
    this.setState({editingRowId: ''})
  }

  renderTopView = () => (
    <>
      <form className="table-design" onSubmit={this.onSubmitEditedData}>
        <table className="users_table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  value="checkedAll"
                  onClick={this.handleAllChecked}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          {this.renderUsersList()}
        </table>
      </form>
      <div className="bottom_pagination">
        <div className="delete_btn_design">
          <button type="button" onClick={this.deleteSelectedUsers}>
            Delete Selected
          </button>
        </div>
      </div>
      <ul className="pagination-ul">
        <AiOutlineArrowLeft onClick={this.onDecrement} className="icon" />
        {pages.map(each => (
          <PaginationRender
            key={each.id}
            details={each}
            isActive={each.id === this.state.activePage}
            setPage={this.setPage}
          />
        ))}
        <AiOutlineArrowRight onClick={this.onIncrement} className="icon" />
      </ul>
    </>
  )

  renderUsersList = () => {
    const { editingRowId, usersList, searchInput, editFormData } = this.state
    const searchResults = usersList.filter(
      eachUser =>
        eachUser.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachUser.role.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachUser.email.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return (
      <tbody>
        {searchResults.map(each => (
          <>
            {editingRowId === each.id ?
              (<EditRow
                editFormData={editFormData}
                onChangeEditInput={this.onChangeEditInput}
                onClickCancel={this.onClickCancel}
              />)
              :
              (<EachUser
                key={each.id}
                details={each}
                deleteUserFromList={this.deleteUserFromList}
                setEditingRowId={this.setEditingRowId}
                handleCheck={this.handleCheck}
              />)}
          </>
        ))}
      </tbody>
    )
  }

  renderFailureView = () => (
    <div className="not-found-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p>OOPS! Something Wrong</p>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllUsers = () => {
    const { apiStatus } = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTopView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const { searchInput } = this.state
    return (
      <div className="search_design">
        <h1 className="main-heading">Users List</h1>
        <input
          type="search"
          className="search_filter"
          value={searchInput}
          placeholder="Search by Name,Email or Role"
          onChange={this.onChangeSearchInput}
        />
        {this.renderAllUsers()}
      </div>
    )
  }
}

export default Users
