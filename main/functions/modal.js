
function createModal(idModal, title, text) {
    let content = `
        <div id="${idModal}" class="myModal">
            <div class="modal-content" id="modal-content_${idModal}">
                <span class="closeBtn" onclick="${closeModal.name}('${idModal}')">&times;</span>
                <div class= title-content>
                <p class="title">${title}</p>
                </div>
                <div class= text-content>
                <p class="text" id="text_${idModal}">${text} </p>
                </div>
                <div class= button-content>
                <button class="acceptBtn" id="accept_${idModal}" onclick="${closeModal.name}(${idModal})">Aceptar</button>
                </div>
            </div>
        </div>`;
    return content;
}


function createModalEvent(idModal, title, text, event) {
    let content = `
        <div id="${idModal}" class="myModal">
            <div class="modal-content" id="modal-content_${idModal}">
                <span class="closeBtn" onclick="${closeModal.name}('${idModal}')">&times;</span>
                <div class= title-content>
                <p class="title">${title}</p>
                </div>
                <div class= text-content>
                <p class="text" id="text_${idModal}">${text} </p>
                </div>
                <div class= button-content>
                <button class="acceptBtn" id="accept_${idModal}" onclick="${event}()">Aceptar</button>
                <button type="button" class="cancelBtn" onclick="${closeModal.name}(${idModal})">cancelar</button>

                </div>
            </div>
        </div>`;
    return content;
}


function getButtonFullID(type, id) {
    return type + "_" + id;
}


function setText(id, text) {
    let element = document.getElementById("text_" + id);
    element.innerHTML = text;
}



function setModalWidth(id, width) {
    const content = document.getElementById("modal-content_" + id);
    content.style.width = width;
}

function setModalHeight(id, height) {
    const content = document.getElementById("modal-content_" + id);
    content.style.height = height;
}


function setMargin(id, top, right, bottom, left) {
    const content = document.getElementById("modal-content_" + id);
    content.style.marginTop = top;
    content.style.marginRight = right;
    content.style.marginBottom = bottom;
    content.style.marginLeft = left;
}

function openModal(idModal) {
    document.getElementById(idModal).style.display = "block";
}

function closeModal(idModal) {
    document.getElementById(idModal).style.display = "none";
  
}


