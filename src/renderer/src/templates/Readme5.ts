const README5 = `# BagIt Backend

📱 This repository houses the frontend for BagIt. BagIt a mobile application that improves the grocery shopping experience, by allowing users to easily create and share shopping lists.

<p align="center">
    <img src="https://raw.githubusercontent.com/jsam07/bag-it/main/Assets/hero.svg" alt="Hero" height="600"/>
</p>

## Architecture
The BagIt backend is shown below (highlighted in red). The frontend is built using .NET MAUI Blazor.
<p align="center">
    <img alt="Search" src="https://raw.githubusercontent.com/jsam07/bag-it/main/Assets/frontend.svg" width="100%"/>
</p>


### Built With

-   ![.NET Maui](https://img.shields.io/badge/-_Maui-050B1E?&logo=dotnet)
-   ![C#](https://img.shields.io/badge/-csharp-050B1E?&logo=csharp)

## Getting Started

### 1. Clone Project

Clone this repository:
\`\`\`
git clone git@github.com:jsam07/bag-it.git
\`\`\`

### 2. Open in Visual Studio Preview 2022

In order to run the MAUI application locally, you'll need to install **the latest version of** Visual Studio Preview 2022 (.NET MAUI Preview 14) with the following workloads:
  - Mobile development with .NET
  - Universal Windows Platform development
  - Desktop development with C++
  - .NET Desktop Development
  - NET and web development (required for Blazor Desktop and the BlazorWebView control)

*Note*: this is important since .NET MAUI is still in preview, breaking changes could occur if this is not done.

Once VS Preview is configured, you can run the app in \`Debug mode\`, using either one of the  pre-installed \`Android Emulators\` or \`Windows Machine\` option. See below.
<p align="center">
    <img alt="Search" src="https://raw.githubusercontent.com/jsam07/bag-it/main/Assets/menu.png" width="100%"/>
</p>

Alternatively, you can do **one** of the following:
1. Build the release version of BagIt via the command: \`dotnet publish -f:net6.0-android -c:Release -o Publish\`
    - The signed apk can then be found in \`Publish/com.companyname.bagit-Signed.apk\`
2.  You can download the pre-built apk [here](https://github.com/jsam07/bag-it/raw/main/Assets/com.companyname.bagit-Signed.apk)

### 3. Testing BagIt

To test the application, you can either register as a new user or use the following credentials to login:

\`\`\`text
Email: "js@gmail.com"
Password: "123456"
\`\`\`

## Status

<p align="center">
    <img alt="Search" src="https://repobeats.axiom.co/api/embed/707a35c3d8b9d2de160e8755549f26e0771b0ec5.svg" width="100%"/>
</p>
`;

export default README5;
