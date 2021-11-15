import './index.css'

const PaginationRender = props => {
  const {details, setPage, isActive} = props
  const {id, pageId} = details
  const btnClassName = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'
  const onClickSetPage = () => {
    setPage(id)
  }
  return (
    <li key={id}>
      <button type="button" onClick={onClickSetPage} className={btnClassName}>
        {pageId}
      </button>
    </li>
  )
}

export default PaginationRender
