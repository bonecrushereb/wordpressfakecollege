import $ from 'jquery';

class MyNotes {
  constructor() {
    $("#my-notes").on("click", ".delete-note" ,this.deleteNote);
    $("#my-notes").on("click", ".edit-note" ,this.editNote.bind(this));
    $("#my-notes").on("click", ".update-note" ,this.updateNote.bind(this));
    $(".submit-note").on("click", this.createNote.bind(this));
  }

   createNote(e) {
    const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/';

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: noteUrl,
      type: 'POST',
      data: { 'title': $('.new-note-title').val(), 'content': $('.new-note-body').val(), 'status': 'publish' },
      success: (res) => {
        $('.new-note-title, .new-note-body').val('');
        $(`
            <li data-id="${res.id}">
              <input readonly class="note-title-field" value="${res.title.raw}" type="text">
              <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</span>
              <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</span>
              <textarea readonly class="note-body-field">${res.content.raw}</textarea>
              <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden=true> Save</i></span>
            </li>
          `).prependTo('#my-notes').hide().slideDown();
      },
      error: (res) => {
          $('.note-limit-message').addClass('active');
          $('.note-limit-message').prepend(res.responseText);
      }
    });
  }

    editNote(e) {
    var thisNote = $(e.target).parents("li");
    if (thisNote.data("state") == "editable") {
      this.noteReadOnly(thisNote);
    } else {
      this.noteEditable(thisNote);
    }
  }

  noteEditable(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
    thisNote.find(".note-title-field, .note-body-field").removeAttr("readonly").addClass("note-active-field");
    thisNote.find(".update-note").addClass("update-note--visible");
    thisNote.data("state", "editable");
  }

  noteReadOnly(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
    thisNote.find(".note-title-field, .note-body-field").attr("readonly", "readonly").removeClass("note-active-field");
    thisNote.find(".update-note").removeClass("update-note--visible");
    thisNote.data("state", "cancel");
  }

  updateNote(e) {
    const thisNote = $(e.target).parents('li');
    const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id');

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: noteUrl,
      type: 'POST',
      data: {'title': thisNote.find('.note-title-field').val() ,'content': thisNote.find('.note-body-field').val()},
      success: (res) => {
        this.noteReadOnly(thisNote);
      },
      error: (res) => {
        console.log(res);
      }
    });
  }

  deleteNote(e) {
    const thisNote = $(e.target).parents('li');
    const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id');
    if(confirm('Are you sure you want to delete ' + thisNote[0].children[0]['value'] + '?')) { 
      $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: noteUrl,
      type: 'DELETE',
      success: (res) => {
        thisNote.slideUp();
        if(res.userNoteCount < 5) {
          $('.note-limit-message').removeClass('active');
          $('.note-limit-message').empty();
        }
      },
      error: (res) => {
        console.log(res);
      }
      });
    } else {
      return false;
    }
  }
}
export default MyNotes;