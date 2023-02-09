let currentPage = 1;
let activePage = 1;
let newsIndex=0;
const newsPaper = document.querySelector(".newspaper");

const newsCollection = {
    header:{
        city:"Chennai",
        state:"TamilNadu",
        day:"Wednesday",
        month:"February",
        date:"8",
        year:"2023",
    },
    news:[
    ]
};

let categories = ["top", "business", "entertainment", "food", "health", "politics", "science", "sports", "technology", "world"];



function getNews(category){
    return new Promise((resolve, reject) => {
        resolve(fetch('https://newsdata.io/api/1/news?apikey=pub_16823c73169be40351a798d4265bdb54dfa0e&language=en&q='+category))
    })
}


const createNewspaper = ()=>{
    for(let i=0;i<categories.length;i++){
        getNews(categories[i])
        .then(response => {
            return response.json();
        })
        .then(json=> {
            console.log(json)
            let newsData = json.results;
            newsCollection.news = newsData.map(data =>{
                // console.log(data);
                let news = {
                    heading: data.title,
                    subHeading:data.description,
                    imgSrc:data.image_url,
                    imgCaption:"",
                    authorName:data.creator!==null?data.creator[0]:"",
                    authorEmail:"",
                    location:data.country!==null?data.country[0]:"",
                    news:data.content
                }
                return news;
            })
            // console.log(newsCollection.news);
            createPage(newsCollection, categories[i])
            currentPage++;
        })
    }
}

setTimeout(addEventListeners, 10000)

const createPage = (paperDetails, category)=>{
    let page ="";
    currentPage===1?
    page = `<div class="page${currentPage}">`:
    page = `<div class="page${currentPage} hidden">`;
    page += currentPage===1?
    addFirstHeader(paperDetails.header):
    addHeader(paperDetails.header, category);
    page += currentPage===1?
    addFirstFooter():
    addFooter();
    page += "</div>";
    // console.log(page);
    newsPaper.innerHTML+=page;
    let main = document.querySelector(`.page${currentPage} .main-content`);
    addNews(paperDetails.news,main);
}

const addFirstHeader = (details)=>{
    return `<header class="main-header">
        <div class="main-header-info">
            <div class="location">
                ${details.city}, ${details.state}
            </div>
            <div class="date">
                ${details.day}, &nbsp;<b>${details.month} ${details.date}</b>, ${details.year}
            </div>
        </div>
        <div class="main-header-title-box">
            <div class="main-header-title-content">
                <div class="main-header-title">
                    MORNING TIMES
                </div>
                <div class="main-header-phase">
                    New Day, New Times
                </div>
            </div>
        </div>
        <hr class="header-bottom-line">
        <hr class="header-bottom-line">
        <hr class="header-bottom-line">
    </header>
    <main class="main-content">`
}

const addHeader = (details, category) => {
    return `
    <header class="main-header">
        <div class="main-header-info">
            <div class="location">
                ${details.city}, ${details.state}
            </div>
            <div class="page">
                Page ${currentPage}, ${category.toUpperCase()}
            </div>
            <div class="date">
                ${details.day}, &nbsp;<b>${details.month} ${details.date}</b>, ${details.year}
            </div>
        </div>
    </header>
    <main class="main-content">
    `
}

const addFirstFooter = ()=>{
    return `
    </main>
    <footer class="footer-first">
        <a href="#" class="next-link">Next Page</a>
    </footer>
    `
}

const addFooter = ()=>{
    return `
    </main>
    <footer class="footer">
        <a href="#" class="previous-link">Previous Page</a>
        <a href="#" class="next-link">Next Page</a>
    </footer>
    `
}

const addNews = (details, main)=>{
    newsIndex=0;
    while(newsIndex<details.length){
        let currentNews = details[newsIndex];
        addArticleToPage(
            currentNews.heading,
            currentNews.subHeading,
            currentNews.imgSrc,
            currentNews.imgCaption,
            currentNews.authorName,
            currentNews.authorEmail,
            currentNews.location,
            currentNews.news,
            main
        );
        newsIndex++;
    }
    // if(newsIndex<details.length){
    //     main.removeChild(main.lastElementChild);
    //     newsIndex--;
    //     currentPage++;
    //     createPage(newsCollection);
    // }
}

const addArticleToPage = (
    heading,
    subHeading,
    imgSrc,
    imgCaption,
    authorName,
    authorEmail,
    location,
    news,
    main
)=>{
    let article=`<div class="article">
        <div class="news-header1">${heading}</div>
        ${subHeading!==""?
        `<div class="sub-header">
            ${subHeading}
        </div>` : ``}
        ${imgSrc!==""&&imgSrc!==null?`<figure>
            <img class="article1-img" src=${imgSrc} alt="${imgCaption}">
            <figcaption>${imgCaption}</figcaption>
        </figure>`:""}
        <div class="news-content-1">
            <div class="news-content-col-1">
                <div class="news-author">
                    <hr class="header-bottom-line">
                    <p class="author-name">${authorName}</p>
                    <hr class="header-bottom-line">
                    <p class="author-email">${authorEmail}</p>
                </div>
                <div class="news-text-1">
                    <p class="first-para"><b>${location} :</b> ${news}</p>
                </div>
            </div>
        </div>
    </div>
    `
    main.innerHTML+=article;
}


function addEventListeners(){
    let nextPage = document.querySelectorAll(".next-link")
    let previousPage = document.querySelectorAll(".previous-link")

    for (var i = 0; i < nextPage.length; i++) {
        nextPage[i].addEventListener("click", () =>{
            document.querySelector(`.page${activePage}`).classList.add("hidden");
            activePage++;
            document.querySelector(`.page${activePage}`).classList.remove("hidden");
        })
    }

    for (var i = 0; i < previousPage.length; i++) {
        previousPage[i].addEventListener("click", () =>{
            document.querySelector(`.page${activePage}`).classList.add("hidden");
            activePage--;
            document.querySelector(`.page${activePage}`).classList.remove("hidden");
        })
    }
    
}



createNewspaper();