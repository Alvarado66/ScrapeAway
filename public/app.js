// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {

  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h3>" + data.title + "</h3>");

      $("#comments").append("<input id='titleinput' name='title' >");

      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Note</button>");

      // If there's a comment in the article
      if (data.comment) {
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});


$(document).on("click", "#savecomment", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })

    .then(function (data) {

      console.log(data);

      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
