import $ from 'jquery';

class Like {
  constructor() {
    $('.like-box').on("click", this.clickDispatcher.bind(this));
  }

  clickDispatcher(e) {
    const currentLikeBox = $(e.target).closest('.like-box');
    if(currentLikeBox.data('exists') == 'yes') {
      this.deleteLike();
    } else {
      this.createLike();
    }
  }

  createLike() {
    console.log('like');
  }

  deleteLike() {
    console.log('dislike');
  }
}

export default Like;