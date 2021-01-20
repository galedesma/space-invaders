document.addEventListener('DOMContentLoaded', () => {
    const squares  = document.querySelectorAll('.grid div');
    const resultOnDisplay = document.querySelector('#result')
    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let result = 0;
    let direction  = 1;
    let invaderId

    //Definimos los invasores
    const alienInvaders = [0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39]

    //Dibujamos los invasores
    alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))

    //Dibujamos el tirador

    squares[currentShooterIndex].classList.add('shooter')

    //Función para que el tirador se mueva horizontalmente
    function moveShooter(e){
        squares[currentShooterIndex].classList.remove('shooter')
        switch(e.keyCode){
            case 37:
                if(currentShooterIndex % width !==0) currentShooterIndex -= 1;
                break;
            case 39:
                if(currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter)

    function moveInvaders(){
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

        if((leftEdge && direction === - 1) || (rightEdge && direction === 1)){
            direction = width
        }else if (direction === width){
            if (leftEdge) direction = 1
            else direction = - 1
        }
        for(let i = 0; i <= alienInvaders.length -1; i++){
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for(let i = 0; i <= alienInvaders.length -1; i++){
            alienInvaders[i] += direction
        }
        for(let i = 0; i <= alienInvaders.length -1; i++){
            if(!alienInvadersTakenDown.includes(i)){
                squares[alienInvaders[i]].classList.add('invader')
            }
        }
        //Decidir si el juego terminó
        //Aliens llegan a la ubicación del tirador
        if(squares[currentShooterIndex].classList.contains('invader', 'shooter')){
            resultOnDisplay.textContent = 'Game Over';
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        //Aliens llegan a la linea inferion
        for(let i = 0; i <= alienInvaders.length - 1; i++){
            if(alienInvaders[i] > (squares.length - (width - 1))){
                resultOnDisplay.textContent = 'Game Over'
                clearInterval(invaderId)
            }
        }

        //Si se gana el juego
        if(alienInvadersTakenDown.length === alienInvaders.length){
            resultOnDisplay.textContent = 'You Win!'
            clearInterval(invaderId)
        }
    }
    invaderId = setInterval(moveInvaders, 500)

    //Dispararle a los aliens
    function shoot(e){
        let laserId;
        let currentLaserIndex = currentShooterIndex
        //El laser se mueve desde el tirador hacia los aliens.
        function moveLaser(){
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')
            if(squares[currentLaserIndex].classList.contains('invader')){
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')

                setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)

                const alienTakeDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakeDown)
                result++
                resultOnDisplay.textContent = result
            }

            if(currentLaserIndex < width){
                clearInterval(laserId)
                setInterval(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }
        switch(e.keyCode){
            case 32:
                laserId = setInterval(moveLaser, 100);
                break
        }
    }

    document.addEventListener('keyup', shoot)
})