import $ from 'jquery';

class MyNotes {
  constructor() {
    this.deleteNote = $('.delete-note');
    this.editNote = $('.edit-note');
    this.events();
  }

  events() {
    this.deleteNote.on("click", (e) => {
      const thisNote = $(e.target).parents('li');
      const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id');
      if(confirm('Are you sure you want to delete ' + $('input').val() + '?')) { 
        $.ajax({
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
        },
        url: noteUrl,
        type: 'DELETE',
        success: (response) => {
          thisNote.slideUp();
        },
        error: (response) => {
          console.log(response);
        }
        });
      } else {
        return false;
      }
    });

    this.editNote.on("click", (e) => {
      const thisNote = $(e.target).parents('li');
      thisNote.find('.note-title-field, .note-body-field').removeAttr('readonly').addClass('note-active-field');
      thisNote.find('.update-note').addClass('update-note--visible');
    });
  }
}

export default MyNotes;