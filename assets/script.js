const slides = [
	{
		"image":"./assets/images/slideshow/slide1.jpg",
		"tagLine":"Impressions tous formats <span>en boutique et en ligne</span>"
	},
	{
		"image":"./assets/images/slideshow/slide2.jpg",
		"tagLine":"Tirages haute définition grand format <span>pour vos bureaux et events</span>"
	},
	{
		"image":"./assets/images/slideshow/slide3.jpg",
		"tagLine":"Grand choix de couleurs <span>de CMJN aux pantones</span>"
	},
	{
		"image":"./assets/images/slideshow/slide4.png",
		"tagLine":"Autocollants <span>avec découpe laser sur mesure</span>"
	}
]
const arrows = [
	{
		"image":"./assets/images/arrow_left.png",
	},
	{
		"image":"./assets/images/arrow_right.png",
	}
]

class Carousel {
	/**
	 * @param {HTMLElement} element 
	 */
	constructor(element) {
		//* Element du DOM sur lequel on va attacher le carousel.
		this.element = element
		//* Creation des éléments du DOM.
		this.root = this.createDivWithClass('carousel')
		this.root.setAttribute('tabindex', '0')// Add a tabindex to the carousel.
		this.container = this.createDivWithClass('carousel-container')
		//* Initialisation des variables.
		this.currentSlide = 0
		this.bullets = []
		//* Ajout des éléments au DOM.
		this.root.appendChild(this.container)
		this.element.appendChild(this.root)
		//* Appel des méthodes.
		this.createCarouselSlides()
		this.createNavigation()
		this.setStyle()
		this.createPagination()
	}

	/**
 	* *Récupère les données du tableau slides et les ajoute au DOM.
 	* @returns {HTMLElement} 
 	*/
	createCarouselSlides() {
		this.carouselSlides = this.createDivWithClass('carousel-slides')
		this.container.appendChild(this.carouselSlides)
		//* Boucle sur le tableau slides pour créer les slides.
  		slides.forEach(slide => {
			this.slideElement = this.createDivWithClass('carousel-slide')

			//! A verifier si c'est mieux de faire comme ça ou comme en dessous.
			this.slideElementImage = document.createElement('img')
			this.slideElementImage.src = slide.image
			this.slideElementImage.alt = 'image'
			this.slideElement.appendChild(this.slideElementImage)
			this.slideElementTagLine = document.createElement('p')
			this.slideElementTagLine.innerHTML = slide.tagLine //! Pour que le span soit pris en compte. Verifier si faillible.
			this.slideElement.appendChild(this.slideElementTagLine)

    		// this.slideElement.innerHTML = `<img src="${slide.image}" alt="image"/> <p>${slide.tagLine}</p>`
			
    		this.carouselSlides.appendChild(this.slideElement)
  		})
	}


	//* Contrôle la largeur du carousel et des slides.
	setStyle() {
		const carouselWidth = slides.length * 100 //? Nombres de slide multiplié par 100.
		this.container.style.width = `${carouselWidth}%` //? On ajoute le % pour que le style soit bien responsive.
		const slideWidth = 100 / slides.length //? Nombres de slide divisé par 100
		this.slideElement.style.width = `${slideWidth}%` //? On ajoute le % pour que le style soit bien responsive.
	}

	//* Creation des fleches de navigations et utilisation du clavier. */
	createNavigation(){
		//* Creation des boutons.
		this.previousButton = this.createDivWithClass('carousel-prev')
		//? AJout de l'image dans le bouton.
		this.arrowLeft = document.createElement('img')
		this.arrowLeft.src = arrows[0].image
		this.arrowLeft.alt = 'arrow_left'
		this.previousButton.appendChild(this.arrowLeft)
		//* Creation des boutons.
		this.nextButton = this.createDivWithClass('carousel-next')
		//? AJout de l'image dans le bouton.
		this.arrowRight = document.createElement('img')
		this.arrowRight.src = arrows[1].image
		this.arrowRight.alt = 'arrow_right'
		this.nextButton.appendChild(this.arrowRight)
		//* Ajout des boutons au DOM.
		this.root.appendChild(this.previousButton)
		this.root.appendChild(this.nextButton)

		//* Ajouts des event listeners sur les fleches de navigation.
		this.previousButton.addEventListener('click', this.previous.bind(this))
		this.nextButton.addEventListener('click', this.next.bind(this))
		//? Avec addEvenListener, this fait référence à l'élément sur lequel on a cliqué.
		//? Mais avec bind(this) on fait référence à la classe Carousel. Donc on peut utiliser les méthodes de la classe.

		//* Ajouts des event listeners sur root pour les fleches du clavier.
		this.root.addEventListener('keydown', (event) => {
			if(event.key === 'ArrowLeft') {
				this.previous()
			} else if(event.key === 'ArrowRight') {
				this.next()
			}
		})
	}

	//* Creation de la pagination. */
	createPagination() {
		const pagination = this.createDivWithClass('carousel-pagination')
		this.root.appendChild(pagination)
		//* Boucle sur les slides pour créer les bullets.
		slides.forEach((slide, index) => {
			//* Creation des bullets.
			const bullet = this.createDivWithClass('carousel-bullet')
			pagination.appendChild(bullet)
			this.bullets.push(bullet)
			//* Ajout de l'event listener sur les bullets.
			bullet.addEventListener('click', () => {
				this.currentSlide = index
				this.moveCarouselTo(this.currentSlide)
				this.activeBullet()
			})
		})
	}

	/**
	 * * Move the carousel to the current slide.
	 * @param {number} currentSlide 
	 */
	moveCarouselTo(currentSlide) {
		const transformValue = `translateX(-${currentSlide * (100 / slides.length)}%)`//?Le slide se déplace de la largueur du slide * l'index du slide courant. Ce qui permet de déplacer le slide en fonction de l'index. En négatif pour que le slide se déplace vers la gauche.
		this.carouselSlides.style.transform = transformValue //? On applique la valeur de transformValue à la propriété transform du carouselSlides.
	}

	//* Go to the previous slide.
	previous() {
		this.currentSlide-- //? On décrémente l'index du slide courant.
		if(this.currentSlide < 0) {//? Si l'index du slide courant est inférieur à 0.
			this.currentSlide = slides.length - 1 //? On revient au dernier slide.
		}
		if(this.currentSlide >= 0){//? Si l'index du slide courant est supérieur ou égal à 0.
			this.activeBullet()
		}
		this.moveCarouselTo(this.currentSlide)
		
	}
	//* Go to the next slide.
	next() {
		this.currentSlide++ //? On incrémente l'index du slide courant.
		if(this.currentSlide >= slides.length) {//? Si l'index du slide courant est supérieur ou égal au nombre de slide.
			this.currentSlide = 0 //? On revient au premier slide.
		}
		if(this.currentSlide < slides.length){//? Si l'index du slide courant est inférieur au nombre de slide.
			this.activeBullet()
		}
		this.moveCarouselTo(this.currentSlide)
	}

	//* Active the current bullet.
	activeBullet() {
		this.bullets.forEach(bullet => bullet.classList.remove('carousel-bullet-active'))
		this.bullets[this.currentSlide].classList.add('carousel-bullet-active')
	}
	/** 
	 * * Create a div with a given class. *
	 * @param {string} className 
	 * @returns {HTMLElement}
	 */
	createDivWithClass(className) {
		const div = document.createElement('div')
		div.setAttribute('class', className)
		return div
	}
}

//? On attend que le DOM soit chargé pour créer le carousel.
document.addEventListener('DOMContentLoaded', function() {
	new Carousel(document.querySelector('#banner'))
})