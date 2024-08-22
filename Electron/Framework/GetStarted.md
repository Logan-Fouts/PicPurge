# Getting Started

Welcome to the setup guide that will get you up and running with the project. This guide includes creating a virtual environment, activating it, installing the necessary dependencies, and finally, running the main script.

## Prerequisites

Before you begin, make sure you have Python installed on your computer. This project is compatible with Python 3.6 and newer versions. You can verify your Python version by executing `python --version` or `python3 --version` in your terminal.

## Setup Instructions

### Step 1: Clone the Project

If you haven't already, clone the project repository to your local machine and navigate to the project directory:

```bash
git clone <git@github.com:Logan-Fouts/Thesis.git>
cd Thesis
```

### Step 2: Create and Activate the Virtual Environment

Create a virtual environment, it can be named `thesis_venv`, within the project directory, execute the following command:

- **For Windows, macOS, and Linux:**
  ```bash
  python -m venv thesis_venv
  ```

After creating the virtual environment, you need to activate it.:

- **Windows:**

  ```cmd
  .\thesis_venv\Scripts\activate
  ```

- **macOS and Linux:**
  ```bash
  source thesis_venv/bin/activate
  ```

### Step 3: Install Required Dependencies

With the virtual environment activated, proceed to install the project's dependencies as listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

### Step 4: Run the Project

Now that the environment is set up and dependencies are installed, you can run the main script of the project:

```bash
python main.py
```

Or, on systems where Python 3 is not the default version, you might need to use `python3`:

```bash
python3 main.py
```

This command executes the `main.py` script, which is the entry point of your project. Make sure to run this from the root directory of the project with the virtual environment activated.

### Step 5: Deactivating the Virtual Environment

When you're done working on the project, you can deactivate the virtual environment by running:

```bash
deactivate
```
