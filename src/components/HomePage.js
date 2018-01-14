import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addPost, fetchPosts, vote, deletePost, setSorting } from '../actions'
import PencilIcon from 'react-icons/lib/fa/pencil'
import Modal from 'react-modal'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import SideNav from './SideNav'

import Category from './Category'
import PostDetail from './PostDetail'

const uuidv1 = require('uuid/v1')

class HomePage extends Component {

  componentWillMount () {
    this.props.fetchData('BY_SCORE_HIGHEST')
  }

  submitVote = (id, voteType) => {
    this.props.dispatch(vote(id, voteType))
  }

  deletePost = id => {
    this.props.dispatch(deletePost(id))
  }

  state = {
    postModalOpen: false,
    postTitle: '',
    postAuthor: '',
    postCategory: 'react',
    postContent: ''
  }

  closeFoodModal = () => {
    this.setState(() => ({
      postModalOpen: false,
      meal: null,
      day: null,
      food: null,
    }))
  }

  handleCreatePost(){
    this.setState(() => ({
      postModalOpen: true,
    }))
  }
  handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      title: this.state.postTitle,
      body: this.state.postContent,
      author: this.state.postAuthor,
      category: this.state.postCategory,
      voteScore: 0,
      deleted: false
    }
    const { addNewPost } = this.props
    addNewPost(data)
    this.props.history.push('/')
  }
  render() {
    const { postModalOpen } = this.state

    return (
      <BrowserRouter>
      <Switch>
      <div className='container'>
        <div className='nav'>
          <h1 className='header'>Readable</h1>
        </div>

        <div>
        <span style={{ fontSize:'28px' ,fontWeight: 'bold', marginBottom: 0}}>Posts</span>
        <button onClick={() => this.handleCreatePost()} className='icon-btn'>
            <PencilIcon size={25}/>
          </button>
          </div>

<SideNav sortBy={this.props.sortBy} />
        {this.props.posts &&
          Object.values(this.props.posts)
            .filter(post => !post.deleted)
            .sort((a, b) => {
              switch (this.props.sortBy) {
                case 'BY_SCORE_LOWEST':
                  return a.voteScore - b.voteScore
                case 'BY_DATE_OLDEST':
                  return a.timestamp - b.timestamp
                case 'BY_DATE_NEWEST':
                  return b.timestamp - a.timestamp
                default:
                  return b.voteScore - a.voteScore
              }
            })
            .map(post =>
              <div className='post' key={uuidv1()}>
              <Link to={`/${post.category}/${post.id}`}>
            <h3 style={{ marginBottom: 0 }}>
              {post.title}
            </h3>
          </Link>
                <span>
                  Author: {post.author}
                </span>
                <span>
                  Score: {post.voteScore}{' '}
                  <span
                    className='clickable plus'
                    onClick={() => this.submitVote(post.id, 'upVote')}
                  >
                    +
                  </span>/<span
                    className='clickable minus'
                    onClick={() => this.submitVote(post.id, 'downVote')}
                  >
                    -
                  </span>
                </span>
                <span>
                  Comments: {post.comments && post.comments.length}
                </span>
                <span>
                <br />
                <Link
                  to={{
                    pathname: `/${post.category}/${post.id}`,
                    state: { postEditorVisible: true }
                  }}
                >
                  Edit
                </Link>{' '}
                /{' '}
                  <span
                    className='clickable'
                    onClick={() => this.deletePost(post.id)}
                  >
                    Delete
                  </span>
                </span>
              </div>
            )}

      <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={postModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel='Modal'
        >
          <div>
            <div className='container'>
              <div className='nav'>
                  <h3 className='subheader'>
                    Add New Post
                  </h3>
              </div>
                  <form onSubmit={this.handleSubmit}>
            <div className='input-container'>
              <label htmlFor='post-title'>
                Title:
                <input
                  type='text'
                  name='postTitle'
                  id='post-title'
                  value={this.state.postTitle}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div className='input-container'>
              <label htmlFor='post-author'>
                Author:
                <input
                  type='text'
                  name='postAuthor'
                  id='post-author'
                  value={this.state.postAuthor}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div className='input-container'>
              <label htmlFor='post-category'>
                Category:
                <select
                  type='text'
                  name='postCategory'
                  id='post-category'
                  value={this.state.postCategory}
                  onChange={this.handleInputChange}
                  required='required'
                >
                  <option value='react'>React</option>
                  <option value='redux'>Redux</option>
                  <option value='udacity'>Udacity</option>
                </select>
              </label>
            </div>
            <div className='input-container'>
              <label htmlFor='post-content'>
                Content:
                <textarea
                  name='postContent'
                  id='post-content'
                  value={this.state.postContent}
                  onChange={this.handleInputChange}
                  required='required'
                />
              </label>
            </div>
            <input type='submit' value='Submit' />
          </form>
                </div>
          </div>
        </Modal>
        </div>
      <Route exact path='/:category' component={Category} />
      <Route path='/:category/:post_id' component={PostDetail} />
      </Switch>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({
  posts: state.postsById,
  sortBy: state.setSorting ? state.setSorting.sort : ''
})

function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    addNewPost: (data) => dispatch(addPost(data)),
    fetchData: sortCriteria =>
      dispatch(fetchPosts()).then(() => dispatch(setSorting(sortCriteria)))

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
