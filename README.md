# ImageCompress

ImageCompress is a Node.js tool for compressing images and converting them to WebP format. It automatically traverses a specified directory, compresses and converts found images, and saves the processed images to a output directory.

## Features

- Automatically traverse and process images in a specified directory
- Support for compressing multiple image formats (e.g., PNG, JPG/JPEG)
- Convert images to WebP format
- Save compressed originals and WebP converted images to a specified directory

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (version 10 or higher)

### Installation

1. Clone this repository to your local machine

```bash
git clone https://github.com/vivian820225/image-compress.git

cd imageCompress
```

2. Install dependencies

```bash
npm install
```

### Usage

Run the following command to compress and convert images in the directory /path/to/images:

```bash
node imageCompress.js /path/to/images
```

The processed images will be saved in the dist subdirectory under the original images directory.
