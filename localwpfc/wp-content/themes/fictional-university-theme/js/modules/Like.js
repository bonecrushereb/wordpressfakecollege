import $ from 'jquery';

class Like {
  constructor() {
    $(".like-box").on("click", this.ourClickDispatcher.bind(this));
  }

  ourClickDispatcher(e) {
    var currentLikeBox = $(e.target).closest(".like-box");

    if (currentLikeBox.attr('data-exists') == 'yes') {
      this.deleteLike(currentLikeBox);
    } else {
      this.createLike(currentLikeBox);
    }
  }

  createLike(currentLikeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'POST',
      data: {'professorId': currentLikeBox.data('professor')},
      success: (res) => {
        currentLikeBox.attr('data-exists', 'yes');
        var likeCount = parseInt(currentLikeBox.find(".like-count").html(), 10);
        likeCount++;
        currentLikeBox.find(".like-count").html(likeCount);
        currentLikeBox.attr("data-like", res);
      },
      error: (res) => {
        console.log(res);
      }
    });
  }

  deleteLike(currentLikeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      data: {'like': currentLikeBox.attr('data-like')},
      type: 'DELETE',
      success: (res) => {
        currentLikeBox.attr('data-exists', 'no');
        var likeCount = parseInt(currentLikeBox.find(".like-count").html(), 10);
        likeCount--;
        currentLikeBox.find(".like-count").html(likeCount);
        currentLikeBox.attr("data-like", '');
      },
      error: (res) => {
        console.log(res);
      }
    });
  }
}

export default Like;
