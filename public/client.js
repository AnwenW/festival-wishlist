(async function () {
  const $list = document.querySelector('table#dreams');

 
  async function getDreams() {
    const res = await fetch('/api/dreams');

    if (!res.ok) {
      console.error('Unexpected status code: ' + res.status);
    }

    const dreams = await res.json();
    return dreams;
  }

  async function createDream(name, description, date) {
    const res = await fetch('/api/dreams', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'name': name, 'description': description, 'date': date })
    });

    if (!res.ok) {
      throw new Error('Unexpected status when creating a new dream: ' + res.status);
    }

    const dream = await res.json();
    return dream;
  }

  async function vote(id) {
    const res = await fetch('/api/dreams/' + id + '/vote', { method: 'POST' });

    if (!res.ok) {
      throw new Error('Unexpected status when voting: ' + res.status);
    }

    const dream = await res.json();
    return dream;
  }

  async function deleteDream(id) {
    const res = await fetch('/api/dreams/' + id, { method: 'DELETE' });

    if (!res.ok) {
      throw new Error('Unexpected status when deleting: ' + res.status);
    }
  }
  

    
  function appendDream(dream) {
    
    const $listItem = document.createElement('tr');
    
    $listItem.setAttribute('class', dream.date);
    
    $listItem.innerHTML = `
      <td class="dream-info"><p class="dream-name"></p><p class="dream-description"></p></td>
      <td class="dream-count"></td>
      <td class="tableButtons"><button class="vote">Vote!</button><button class="remove">Remove</button></td>
    `;
    
    const $count = $listItem.querySelector('.dream-count');
   
    $count.textContent = dream.count+1;

    const $dreamInfo = $listItem.querySelector('.dream-info');
    
    const $tableButtons = $listItem.querySelector('.tableButtons');
    
    const $name = $listItem.querySelector('.dream-name');

    $name.textContent = dream.name;
    
    const $description = $listItem.querySelector('.dream-description');
   
    $description.textContent = dream.description;
    
    
    // To center dream name vertically in row when no description entered
    if (dream.description === '') {
      $description.classList.add("emptyP");
    } 

    const $vote = $listItem.querySelector('.vote');
    
    $vote.onclick = async function (event) {
      const updatedDream = await vote(dream.id);

      $count.textContent = updatedDream.count+1;
      
      $count.classList.add("voteeffect");
      $count.addEventListener("animationend", function () {
        $count.classList.remove("voteeffect");    
      });
    };
    
    const $delete = $listItem.querySelector('.remove');
    
    $delete.onclick = async function (event) {
      
      const confirmRemove = confirm("Delete " + dream.name.toUpperCase() + " from the list?");
      
      if (confirmRemove === true) {
        await deleteDream(dream.id);
        $listItem.remove();
      } 
      
    };
    
     // Add hover effect to buttons on desktop, with function isTouchDevice() (see function at bottom)
    if (isTouchDevice() == false) {
      $delete.classList.add("canhover");
      $vote.classList.add("canhover");
      const submitButton = document.querySelector('.submit-tip');
      submitButton.classList.add("canhover");
    } 

    
    $listItem.appendChild($dreamInfo);
    $listItem.appendChild($count);
    $listItem.appendChild($tableButtons);
    
    const theFirstChild = $list.firstChild;
    
    $list.insertBefore($listItem, theFirstChild);
    
  } // ends function appendDream //
  

  for (const dream of await getDreams()) {
    appendDream(dream);
  }

  document.querySelector('form').onsubmit = async function (event) {
    event.preventDefault();

    const $form = document.forms[0];
    
    const $name = $form.querySelector('input[name="name"]');
    const $description = $form.querySelector('input[name="description"]');
    
    //   Get all the 'date' checkbox fields and create a string based on which ones are checked //
    const $dates = document.getElementsByName('date[]');
    let dateValues = "";
    for (let i = 0; i < $dates.length; i++ ) {
      if ( $dates[i].checked ) {
        dateValues += $dates[i].value + " ";
      }
    }
    
    const dream = await createDream($name.value, $description.value, dateValues);

    appendDream(dream);

    //   clear all input fields
    $name.value = '';
    $description.value = '';
    $name.focus();
    
    for (let i = 0; i < $dates.length; i++ ) {
      $dates[i].checked = false;
    }
    
  };
  
}()); // ends async function () //



// ==========  FILTER TABLE TABS BY DAY  ========= //


function filter(tableClass) {
  
  var table = document.getElementById("dreams");
  var tr = table.getElementsByTagName("tr");

  for (var i = 0; i < tr.length; i++) {
    
    if (tableClass === "allDays") {
      tr[i].style.display = "";
      
    } else if (tr[i].classList.contains(tableClass)) {
      tr[i].style.display = "";
      
    } else {
        tr[i].style.display = "none";
    }
    
  }
 
} 



//////   SORT TABLE A-Z OR TOP RATED   //////

function sortTable(n, columnType) {
  
  var table, rows, switching, i, x, y, shouldSwitch;
  
  table = document.getElementById("dreams");
  
  switching = true;
  
  while (switching) {
    
    switching = false;
    
    rows = table.getElementsByTagName("TR");
    
    for (i = 0; i < (rows.length - 1); i++) {
  
      shouldSwitch = false;
      
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      
      if (columnType === "ratings") {
        x = parseInt(x.innerHTML);
        y = parseInt(y.innerHTML);
        if (y > x) {
          shouldSwitch = true;
          break;
        }
      } else {
        x = x.innerHTML.toLowerCase();
        y = y.innerHTML.toLowerCase();
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }
    }
    
    if (shouldSwitch) {
      
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      
      switching = true;
      
    }
  }
}



//////   SMOOTH SCROLL FROM TEXT LINK TO ANCHOR ID  //////

scrollTo = (element) => {
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: element.offsetTop
  });
}

document.getElementById("toFooter").addEventListener('click', () => {
  scrollTo(document.getElementById("contact"));
});

document.getElementById("contact").addEventListener('click', () => {
  scrollTo(document.getElementById("pageTop"));
});



//////  NOT WORKING ON SAFARI  //////
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
