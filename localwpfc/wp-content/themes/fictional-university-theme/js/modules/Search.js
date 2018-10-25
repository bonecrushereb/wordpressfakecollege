import $ from 'jquery';

class Search {
  constructor() {
    this.searchResults = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $('#search-term');
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.prevValue;
    this.typingTimer;
  }

  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.typingLogic.bind(this));
  }


  typingLogic() {
    const url = universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val();
    if (this.searchField.val() != this.prevValue) {
      clearTimeout(this.typingTimer);

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.searchResults.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(function() {
          $.getJSON(url, data => {
            this.searchResults.html(`
              <h2 class="search-overlay__section-title">General Information</h2>
              ${data.length ? '<ul class="linked-list min-list">': '<p>No General Information found.</p>'}
                ${data.map(data => `<li><a href="${data.link}">${data.title.rendered}</a></li>`).join('')}
              `);
            this.isSpinnerVisible = false;
          }); 
        }.bind(this), 2000);
      } else {
        this.searchResults.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.prevValue = this.searchField.val();
  }

  keyPressDispatcher(e) {
    if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
      this.openOverlay();
    } else if (e.keyCode  == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
    this.isOverlayOpen = false;
  }
}


export default Search;