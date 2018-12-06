import $ from 'jquery';

class Like {
  constructor() {
    $('.like-box').on("click", this.clickDispatcher.bind(this));
  }

  clickDispatcher(e) {
    const currentLikeBox = $(e.target).closest('.like-box');
    if(currentLikeBox.data('exists') == 'yes') {
      this.deleteLike(currentLikeBox);
    } else {
      this.createLike(currentLikeBox);
    }
  }

  createLike(currentLikeBox) {
    $.ajax({
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'POST',
      data: { 'professorId': currentLikeBox.data('professor') },
      success: (res) => {
        console.log(res);
      },
      error: (res) => {
        console.log(res);
      }
    });
  }

  deleteLike(currentLikeBox) {
    $.ajax({
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'DELETE',
      success: (res) => {
        console.log(res);
      },
      error: (res) => {
        console.log(res);
      }
    })
  }
}

export default Like;