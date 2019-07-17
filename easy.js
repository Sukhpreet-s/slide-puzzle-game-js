/* eslint-disable no-plusplus */
// distance: number of pixels a puzzle piece will move
const DISTANCE = 100;
/** ********************************
// Create puzzlePieces data structure.
// I suggest using an array of objects but feel free to change that
// An example of a puzzle piece object could be: { name: ".box1", x: 0, y: 0 }
********************************* */

const boxElements = [...document.querySelectorAll('[class^="box"]')];
let boxX = 0;
let boxY = 0;

const puzzlePieces = boxElements.map((box, index) => {
  if (index % 4 === 0 && index !== 0) {
    boxY += 100;
    boxX = 0;
  } else if (index !== 0) {
    boxX += 100;
  }
  return {
    name: `.${box.className}`,
    x: boxX,
    y: boxY,
  };
});

// store the original location of the pieces to check whether the user have won
const originalLocation = puzzlePieces.map(piece => ({
  x: piece.x,
  y: piece.y,
}));

// blankSpace: initialize blank square as last piece so as to remember where it is.
// Will eventually use it to ask direction of clicked puzzle piece(s).
// Once pieces move, must remember to update x,y values to new blank space coords
const blankSpace = { x: 300, y: 300, order: 16 };

// I'm structuring my program sort of like how Vue does it - all in my puzzle object below.
const puzzle = {
  pieces: puzzlePieces,
  distance: DISTANCE,
  blankSpace,
  currentPiece: null,
  currentPiecesArr: [],
  directionToMove: '',
  isShuffling: true,
  initialize() {
    /** **********************************     
    // Implement initialize function such that it
    // attache click event handlers for each piece
    // and within that, invokes the slide function
    ************************************** */
    this.attachListenerToPieces();
    // show puzzle pieces
    this.display();
    this.shufflePieces();
  },
  display() {
    // initialize pieces to their proper order
    this.pieces.forEach(piece => {
      const pieceDOM = document.querySelector(piece.name);
      // eslint-disable-next-line no-undef
      TweenLite.set(pieceDOM, { x: piece.x, y: piece.y });
    });
  },
  slide() {
    // call isMoveable to find out direction to move
    this.directionToMove = this.isMoveable();
    // remember to adjust coordinates including adjusting blank piece's coordinates
    /** **********************************
    // Implement slide function so that you set x,y coordinates of appropriate puzzle piece(s)
    ******************************** */
    this.setCoordinates();

    // Now animate current puzzle piece now that x, y coordinates have been set above
    this.moveCurrentPieces();

    // display if the player has won
    if (this.winner() && !this.isShuffling) {
      alert('won!');
    }
  },
  isMoveable() {
    /** ******************************************
    // Implement isMoveable function to find out / return which direction to move
    // Is the clicked piece movable?
    // If yes, then return a direction to one of: "up", "down", "left", "right"
    // If no, then return a direction of ""
     ***************************************** */
    const currPieceObj = this.pieces[this.currentPiece.dataset.idx];
    if (blankSpace.y === currPieceObj.y) {
      if (blankSpace.x > currPieceObj.x) {
        return 'right';
      }
      if (blankSpace.x < currPieceObj.x) {
        return 'left';
      }
      return '';
    }
    if (blankSpace.x === currPieceObj.x) {
      if (blankSpace.y > currPieceObj.y) {
        return 'down';
      }
      if (blankSpace.y < currPieceObj.y) {
        return 'up';
      }
      return '';
    }
    return '';
  },
  winner() {
    // Check when all the pieces are at there original location
    for (let i = 0; i < this.pieces.length; i++) {
      if (
        this.pieces[i].x !== originalLocation[i].x ||
        this.pieces[i].y !== originalLocation[i].y
      ) {
        return false;
      }
    }
    // Check if clicked piece is moveable or not
    return ['up', 'down', 'left', 'right'].includes(this.directionToMove);
  },
  attachListenerToPieces() {
    /* ***************** 
    // Attaching listener to all the pieces when initializing
    // Setting the current piece equal to clicked piece
    // Then invoking the slide method 
    ******************** */
    this.pieces.forEach(piece => {
      const pieceDOM = document.querySelector(piece.name);
      pieceDOM.addEventListener('click', e => {
        this.currentPiece = e.target;
        this.slide();
      });
    });
  },
  setCoordinates() {
    /* ********************
    // Getting all the pieces to be moved depending on direction
    // Then setting their coordinates to actually move them to destination location
    ******************** */
    const currPieceObj = this.pieces[this.currentPiece.dataset.idx];

    switch (this.directionToMove) {
      case 'right':
        this.currentPiecesArr = this.pieces.filter(
          piece =>
            piece.y === currPieceObj.y &&
            piece.x >= currPieceObj.x &&
            piece.x < blankSpace.x
        );
        this.currentPiecesArr.forEach(piece => (piece.x += 100));
        this.blankSpace.x -= this.currentPiecesArr.length * 100;
        break;
      case 'left':
        this.currentPiecesArr = this.pieces.filter(
          piece =>
            piece.y === currPieceObj.y &&
            piece.x > blankSpace.x &&
            piece.x <= currPieceObj.x
        );
        this.currentPiecesArr.forEach(piece => (piece.x -= 100));
        this.blankSpace.x += this.currentPiecesArr.length * 100;
        break;
      case 'down':
        this.currentPiecesArr = this.pieces.filter(
          piece =>
            piece.x === currPieceObj.x &&
            piece.y >= currPieceObj.y &&
            piece.y < blankSpace.y
        );
        this.currentPiecesArr.forEach(piece => (piece.y += 100));
        this.blankSpace.y -= this.currentPiecesArr.length * 100;
        break;
      case 'up':
        this.currentPiecesArr = this.pieces.filter(
          piece =>
            piece.x === currPieceObj.x &&
            piece.y > blankSpace.y &&
            piece.y <= currPieceObj.y
        );
        this.currentPiecesArr.forEach(piece => (piece.y -= 100));
        this.blankSpace.y += this.currentPiecesArr.length * 100;
        break;
      default:
    }
  },
  moveCurrentPieces() {
    /* *******************
    // Moving the pieces captured by setCoordinates into currentPiecesArr
    // Using TweenMax library for the animation
    ********************** */
    this.currentPiecesArr.forEach(piece => {
      const pieceDOM = document.querySelector(piece.name);
      // eslint-disable-next-line no-undef
      TweenMax.to(pieceDOM, 0.17, {
        x: piece.x,
        y: piece.y,
        // eslint-disable-next-line no-undef
        ease: Power0.easeNone,
      });
    });
  },
  shufflePieces() {
    /* *************
    // Generate random number between 0 - 14 
    // Select the DOM Piece with that index
    // invoke click() method to make it move 
    // check whether the generated random number is equal to previous one
    //repeat all the steps many times to shuffle
    ************** */
    let randomNumber;
    let previousNumber = 15;
    let i = 0;
    while (i < 500) {
      randomNumber = Math.floor(Math.random() * 15);
      if (randomNumber !== previousNumber) {
        boxElements[randomNumber].click();
        previousNumber = randomNumber;
      }
      i++;
    }
    this.isShuffling = false;
  },
};

puzzle.initialize();
