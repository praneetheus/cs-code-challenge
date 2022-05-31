'use strict';
import { getUserData } from "./api.js";

const userData = await getUserData();
fillTemplate(userData);

function fillTemplate(data) {
  Handlebars.registerHelper("formatTime", function(createdAt) {
    const formattedDate = new Date(createdAt);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return formattedDate.toLocaleString("en-US", options);
  });

  const rawTemplate = document.getElementById("user-data-handlebars-template").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  const generatedHTML = compiledTemplate({data});

  let userContainer = document.getElementById('handlebars-template-container');
  userContainer.innerHTML = generatedHTML;
}

