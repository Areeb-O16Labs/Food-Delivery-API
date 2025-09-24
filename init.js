import { exec } from 'child_process';
import { spawn } from 'cross-spawn';
import { unlinkSync } from 'fs';
import inquirer from 'inquirer';

// Define optional packages for selection
const optionalPackages = [
  { name: 'Moment', value: 'moment' },
  { name: 'Date-fns', value: 'date-fns' },
];

// Validation utilities
const validators = {
  projectName: (val) =>
    /^([a-z0-9]+[-_]?)*[a-z0-9]$/i.test(val)
      ? true
      : 'Project name must be alphanumeric and may include hyphens or underscores, no spaces (1-32 chars).',
  projectDescription: (val) =>
    val.length <= 64
      ? true
      : 'Project description must be 64 characters or less.',
};

// Install selected packages
async function installPackages(selectedPackages) {
  if (selectedPackages.length === 0) {
    console.error('No packages selected!');
    return;
  }

  console.log(`Installing packages: ${selectedPackages.join(', ')}...`);
  const installationProcess = spawn('npm', ['install', ...selectedPackages], {
    stdio: 'inherit',
  });

  try {
    await new Promise((resolve, reject) => {
      installationProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Installation completed successfully.');
          resolve();
        } else {
          reject(new Error('Installation failed.'));
        }
      });
    });
  } catch (error) {
    console.error('Installation failed:', error);
  }
}

// Project configuration and package selection
async function configureProject() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name?',
        default: 'nestjs-api',
        validate: validators.projectName,
      },
      {
        type: 'input',
        name: 'projectDesc',
        message: 'Project description?',
        default: 'New NestJs project',
        validate: validators.projectDescription,
      },
      {
        type: 'list',
        name: 'dbService',
        message: 'Which service will you use for databae?',
        choices: [
          { name: 'Postgres', value: 'pg' },
          { name: 'MySql', value: 'mysql' },
        ],
      },
      {
        type: 'list',
        name: 'uploadService',
        message: 'Which service will you use for file upload?',
        choices: [
          { name: 'AWS S3', value: 'aws-sdk' },
          { name: 'Cloudinary', value: 'cloudinary' },
        ],
      },
      {
        type: 'list',
        name: 'emailService',
        message: 'Which service will you use for send email?',
        choices: [
          { name: 'SendGrid', value: ['@sendgrid/mail'] },
          {
            name: 'AWS SES',
            value: [
              'nodemailer',
              '-D @types/nodemailer',
              '@aws-sdk/client-ses',
            ],
          },
        ],
      },
      {
        type: 'confirm',
        name: 'notificationService',
        message: 'Do you want to include push notification service?',
      },
      {
        type: 'confirm',
        name: 'paymentService',
        message: 'Do you want to include payment service?',
      },
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select the packages you want to include in your project:',
        choices: optionalPackages,
      },
    ]);

    // Process answers and determine selected packages
    let selectedPackages = processSelectedOptions(answers);
    await installPackages(selectedPackages);
  } catch (error) {
    console.error('An error occurred during project configuration:', error);
  }
}

// Process selected options and determine the packages to install
function processSelectedOptions(answers) {
  let selectedPackages = [];
  const configPath = './src/config/';
  exec(
    `npm pkg set name="${answers.projectName}" description="${answers.projectDesc}" type="commonjs"`,
  );

  if (answers.notificationService) selectedPackages.push('firebase-admin');
  else safeRemoveFile(`${configPath}notification.ts`);
  if (answers.paymentService) selectedPackages.push('stripe');
  else safeRemoveFile(`${configPath}stripe.service.ts`);
  if (answers.uploadService == 'cloudinary')
    safeRemoveFile(`${configPath}s3.service.ts`);
  else safeRemoveFile(`${configPath}cloudinary.service.ts`);
  if (answers.emailService[0] == 'nodemailer')
    safeRemoveFile(`${configPath}sendgrid.ts`);
  else safeRemoveFile(`${configPath}nodemailer.ts`);

  selectedPackages.push(answers.dbService);
  selectedPackages.push(answers.uploadService);
  selectedPackages = [
    ...selectedPackages,
    ...answers.selectedPackages,
    ...answers.emailService,
  ];

  return selectedPackages;
}

function safeRemoveFile(filePath) {
  try {
    unlinkSync(filePath);
    console.log(`Successfully removed ${filePath}`);
  } catch (error) {
    console.error(`Error removing file ${filePath}:`, error.message);
    if (error.code !== 'ENOENT') {
      throw error; // Re-throw the error if it's not a 'file not found' error
    }
  }
}

// Initiate the script
configureProject();
