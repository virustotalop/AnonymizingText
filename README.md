# Anonymizing Text

This project is meant to be research in anonymizing a user's text. There has been previous research into anonymizing text but its few and far between. The de-anonymizing process is stylometry, [some reading on the topic can be found here](documentation/RESEARCH.md). All tools that have been created for the project can be found in the [tools directory](/tools)

# Getting started

## Loading in browser plugin

* Have the latest version of Firefox installed.
* Download the latest version of the repository.
* Unzip the repository
* Navigate to about:debugging
* Load in a temporary extension
* Navigate to where the repository was unzipped to
* Select the manifest.json to load in the plugin

## Development

If you want to help with development you can take a look at the [tools directory](/tools) for getting the development environment setup.

# How does it work?

The project works by using natural language processing and using a thesaurus to do word replacements.

# How well does it work?

If you want to see how well the project is working over time you can refer to the [generated reports.](documentation/analysis-reports.md)

# Libraries

* Compromise
* Praw
* Flask
* PyAutoGui
* Selenium
* TextBlob
