<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ftrbnd/myrunningplaylist">
    <img src="public/favicon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">My Running Playlist</h3>

  <p align="center">
    Achieve your goal race time with your playlist
    <br />
    <a href="https://myrunningplaylist.com">View Demo</a>
    ·
    <a href="https://github.com/ftrbnd/myrunningplaylist/issues">Report Bug</a>
    ·
    <a href="https://github.com/ftrbnd/myrunningplaylist/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#configuration">Configuration</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Screen Shot][product-screenshot-1]][project-url]

A lightweight web app designed to make editing playlists simple with viewable timestamps to synchronize to your goal race time.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Typescript][Typescript]][Typescript-url]
- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Tailwind][TailwindCss]][Tailwind-url]
- [![Shadcn][Shadcn]][Shadcn-url]
- [![Drizzle][Drizzle]][Drizzle-url]

* [![NeonDb][NeonDb]][NeonDb-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Client id, client secret, and redirect uri from [Spotify](https://developer.spotify.com/documentation/web-api)
- Database url from [Neon][Neondb-url]

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ftrbnd/myrunningplaylist.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the local dev server
   ```sh
   npm run dev
   ```

### Configuration

Create a `.env` file at the root and fill out the values:

```env
    DATABASE_URL=""

    SPOTIFY_CLIENT_ID=""
    SPOTIFY_CLIENT_SECRET=""
    SPOTIFY_REDIRECT_URL="http://localhost:3000/spotify"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Viewing your playlists

[![Product Screenshot][product-screenshot-1]][project-url]

### Viewing a single playlist

[![Product Screenshot][product-screenshot-2]][project-url]

### Setting a goal race time

[![Product Screenshot][product-screenshot-3]][project-url]

### Viewing race timestamps

[![Product Screenshot][product-screenshot-4]][project-url]

### Rearranging tracks

[![Product Screenshot][product-screenshot-5]][project-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Giovanni Salas - [@finalcalI](https://twitter.com/finalcali) - giosalas25@gmail.com

Project Link: [https://github.com/ftrbnd/myrunningplaylist](https://github.com/ftrbnd/myrunningplaylist)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/ftrbnd/myrunningplaylist.svg?style=for-the-badge
[contributors-url]: https://github.com/ftrbnd/myrunningplaylist/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ftrbnd/myrunningplaylist.svg?style=for-the-badge
[forks-url]: https://github.com/ftrbnd/myrunningplaylist/network/members
[stars-shield]: https://img.shields.io/github/stars/ftrbnd/myrunningplaylist.svg?style=for-the-badge
[stars-url]: https://github.com/ftrbnd/myrunningplaylist/stargazers
[issues-shield]: https://img.shields.io/github/issues/ftrbnd/myrunningplaylist.svg?style=for-the-badge
[issues-url]: https://github.com/ftrbnd/myrunningplaylist/issues
[license-shield]: https://img.shields.io/github/license/ftrbnd/myrunningplaylist.svg?style=for-the-badge
[license-url]: https://github.com/ftrbnd/myrunningplaylist/blob/master/LICENSE.txt
[project-url]: https://myrunningplaylist.com
[product-screenshot-1]: https://i.imgur.com/NA9qaPn.png
[product-screenshot-2]: https://i.imgur.com/w930esM.png
[product-screenshot-3]: https://i.imgur.com/hE9Jloj.png
[product-screenshot-4]: https://i.imgur.com/cPGl9LT.png
[product-screenshot-5]: https://i.imgur.com/6Z9YDs8.png
[Typescript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCss]: https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Shadcn]: https://img.shields.io/badge/-shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=fff
[Shadcn-url]: https://ui.shadcn.com/
[Drizzle]: https://img.shields.io/badge/drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F
[Drizzle-url]: https://orm.drizzle.team/
[NeonDb]: https://img.shields.io/badge/neon-00e599?style=for-the-badge
[NeonDb-url]: https://neon.tech/
