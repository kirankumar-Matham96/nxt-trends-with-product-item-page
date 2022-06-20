import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    apiStatus: apiStatusConstants.initial,
    productQuantity: 1,
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  onIncrementProductQuantity = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  onDecrementProductQuantity = () => {
    this.setState(prevState => ({
      productQuantity:
        prevState.productQuantity !== 1 ? prevState.productQuantity - 1 : 1,
    }))
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const JWT_TOKEN = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        productDetails: data,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSimilarProducts = similarProducts => {
    const updatedSimilarProducts = {
      availability: similarProducts.availability,
      brand: similarProducts.brand,
      description: similarProducts.description,
      id: similarProducts.id,
      imageUrl: similarProducts.image_url,
      price: similarProducts.price,
      rating: similarProducts.rating,
      style: similarProducts.style,
      title: similarProducts.title,
      totalReviews: similarProducts.total_reviews,
    }

    const {
      brand,
      title,
      id,
      imageUrl,
      price,
      rating,
      //   availability,
      //   description,
      //   style,
      //   totalReviews,
    } = updatedSimilarProducts

    return (
      <li className="similar-products-card-container" key={id}>
        <img
          src={imageUrl}
          alt="similar product"
          className="similar-products-card-img"
        />
        <p className="similar-products-card-title">{title}</p>
        <p className="similar-products-card-brand">by {brand}</p>
        <div className="similar-products-card-price-rating-container">
          <p className="similar-products-card-price">Rs {price}/-</p>
          <div className="similar-products-card-rating-container">
            <p className="similar-products-card-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="similar-products-card-rating-star"
            />
          </div>
        </div>
      </li>
    )
  }

  renderSuccessView = () => {
    const {productDetails, productQuantity} = this.state
    const updatedProductDetails = {
      availability: productDetails.availability,
      brand: productDetails.brand,
      description: productDetails.description,
      id: productDetails.id,
      imageUrl: productDetails.image_url,
      price: productDetails.price,
      rating: productDetails.rating,
      similarProducts: productDetails.similar_products,
      style: productDetails.style,
      title: productDetails.title,
      totalReviews: productDetails.total_reviews,
    }

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      similarProducts,
      title,
      totalReviews,
    } = updatedProductDetails

    return (
      <>
        <div className="product-details-main-container">
          <img
            src={imageUrl}
            alt="product"
            className="product-item-details-img"
          />
          <div className="product-details-data-container">
            <h1 className="product-item-details-name">{title}</h1>
            <p className="product-item-details-price">Rs {price}/-</p>
            <div className="product-item-details-rating-review-container">
              <div className="product-details-rating-star-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="product-details-rating-star"
                />
              </div>
              <p className="product-details-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-details-review-description">{description}</p>
            <p className="product-details-availability-and-brand">
              <span className="product-details-availability-and-brand-header">
                Available:{' '}
              </span>
              {availability}
            </p>
            <p className="product-details-availability-and-brand">
              <span className="product-details-availability-and-brand-header">
                Brand:{' '}
              </span>
              {brand}
            </p>
            <hr className="h-line" />
            <div className="product-details-quantity-container">
              <button
                type="button"
                testid="minus"
                className="product-details-quantity-button"
                onClick={this.onDecrementProductQuantity}
              >
                <BsDashSquare />
                <AiOutlineMinus />
              </button>
              <p className="product-details-quantity">{productQuantity}</p>
              <button
                type="button"
                testid="plus"
                className="product-details-quantity-button"
                onClick={this.onIncrementProductQuantity}
              >
                <BsPlusSquare />
                <AiOutlinePlus />
              </button>
            </div>
            <button className="add-to-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="product-details-similar-products-container">
          <h1 className="similar-products-main-title">Similar Products</h1>
          <ul className="similar-products-cards-list-container">
            {similarProducts.map(eachProduct =>
              this.renderSimilarProducts(eachProduct),
            )}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div
      className="loading-view-container products-loader-container"
      testid="loader"
    >
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failed-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failed-view-img"
      />
      <h1 className="filed-view-title">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const JWT_TOKEN = Cookies.get('jwt_token')

    if (JWT_TOKEN === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="product-item-details-bg-container">
          {this.renderProductDetailsView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
