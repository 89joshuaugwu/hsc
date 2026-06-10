import {
  Home,
  Radio,
  Bell,
  CalendarDays,
  Users,
  Image as ImageIcon,
  CreditCard,
  BanknotesIcon,
  UserCheck,
  Mail,
  Heart,
  Settings,
  HelpCircle,
} from "lucide-react";
import React from "react";

export type HelpSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  path: string; // The pathname where this help should show
  content: {
    title: string;
    steps: string[];
  }[];
};

export const ADMIN_HELP_DATA: HelpSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: HelpCircle,
    path: "/admin/admin-guide", // default or fallback
    content: [
      {
        title: "How to log in",
        steps: [
          "Go to the admin login page and enter your registered email and password.",
          "Click **Login to Dashboard**.",
        ],
      },
      {
        title: "What is Two-Factor Authentication (2FA)",
        steps: [
          "2FA adds an extra layer of security. When logging in, you will be asked to enter a 6-digit code sent to your email.",
          "You can enable or disable this feature in the **Settings** page.",
        ],
      },
      {
        title: "How to navigate the dashboard",
        steps: [
          "Look at the left sidebar (or the menu on mobile) to see all the pages.",
          "Click any icon or name to jump directly to that section.",
          "Use the **Help** icon at the top right of any page if you forget how something works.",
        ],
      },
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    path: "/admin",
    content: [
      {
        title: "What the stat cards mean",
        steps: [
          "The top cards show a quick summary of your church's digital presence.",
          "You can see your total **Subscribers**, **Pending Payments** that need verification, and new **Messages**.",
        ],
      },
      {
        title: "How to use Quick Actions",
        steps: [
          "The **Quick Actions** section contains shortcuts to your most common tasks, like creating an event or viewing prayers.",
        ],
      },
      {
        title: "Recent Messages and Payments",
        steps: [
          "These tables give you a glance at the newest contact messages and bank transfers.",
          "Clicking on them will usually guide you to their full pages for more details.",
        ],
      },
      {
        title: "Going Live",
        steps: [
          "The **Go Live** or **End Live** button on the dashboard is a shortcut to start or stop a live broadcast indicator on the public website.",
        ],
      },
    ],
  },
  {
    id: "live-manager",
    title: "Live Manager",
    icon: Radio,
    path: "/admin/live",
    content: [
      {
        title: "What 'Going Live' means",
        steps: [
          "When you go live, a prominent **LIVE** badge appears on the main website.",
          "Visitors will see what activity is currently happening.",
        ],
      },
      {
        title: "How to select an activity",
        steps: [
          "Look for the **Select Activity** dropdown menu.",
          "Choose a preset like 'Sunday Service' or 'Midweek Service'.",
          "Click **Go Live Now** to instantly update the website.",
        ],
      },
      {
        title: "How to create a custom activity",
        steps: [
          "Click **New Custom Activity**.",
          "Enter a name (like 'Special Youth Conference') and an optional description.",
          "Click **Create & Go Live**.",
        ],
      },
      {
        title: "How to edit or delete activity presets",
        steps: [
          "Look at the list of **Saved Presets**.",
          "Click the **Pencil icon** to edit the name or description.",
          "Click the **Trash can icon** to permanently delete the preset.",
        ],
      },
      {
        title: "How to end a live session",
        steps: [
          "While you are live, the button will turn red and say **End Live Session**.",
          "Click it when the service is over to remove the LIVE badge from the website.",
        ],
      },
    ],
  },
  {
    id: "announcements",
    title: "Announcements",
    icon: Bell,
    path: "/admin/announcements",
    content: [
      {
        title: "How to create a new announcement",
        steps: [
          "Click the **New** button at the top right.",
          "Fill in the **Title** and **Content**.",
          "Click **Create** to save.",
        ],
      },
      {
        title: "What 'Featured' means",
        steps: [
          "If you check the **Featured** box, the announcement will show prominently at the top of the homepage inside a scrolling banner.",
        ],
      },
      {
        title: "What the 'Active' toggle does",
        steps: [
          "If **Active** is checked, the public can see it.",
          "Uncheck it if you want to hide the announcement without deleting it.",
        ],
      },
      {
        title: "How to set start and end dates",
        steps: [
          "When creating or editing, use the date selectors to choose when the announcement applies.",
          "These dates help visitors know when the event or notice is relevant.",
        ],
      },
      {
        title: "How to edit or delete an announcement",
        steps: [
          "Find the announcement in the table.",
          "Click the **Pencil icon** to update its details.",
          "Click the **Trash can icon** to remove it permanently.",
        ],
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    icon: CalendarDays,
    path: "/admin/events",
    content: [
      {
        title: "How to add a new event",
        steps: [
          "Click the **New Event** button.",
          "Click the upload area or drag a photo from your computer into the box to add a cover image.",
          "Fill out the required details like Title, Date, and Location.",
          "Click **Save Event**.",
        ],
      },
      {
        title: "What 'Featured' means",
        steps: [
          "A **Featured** event shows as the massive highlight card at the top of the public Events page.",
          "Only one event should be featured at a time for the best look.",
        ],
      },
      {
        title: "What 'Requires Registration' does",
        steps: [
          "If your event needs tickets or an RSVP, check this box.",
          "Paste the link (like a Google Form or Eventbrite) into the **Registration URL** box.",
          "A **Register Now** button will appear for visitors.",
        ],
      },
      {
        title: "How to filter events",
        steps: [
          "Use the tabs above the events list (like **Upcoming**, **Past**, or **All**) to quickly find what you are looking for.",
        ],
      },
      {
        title: "How to edit or delete an event",
        steps: [
          "Click the **Pencil icon** next to any event to change its details.",
          "Click the **Trash can icon** to remove it permanently.",
        ],
      },
    ],
  },
  {
    id: "departments",
    title: "Departments",
    icon: Users,
    path: "/admin/departments",
    content: [
      {
        title: "How to add a new department",
        steps: [
          "Click **New Department**.",
          "Fill in the name, description, and leader details.",
          "Click **Save**.",
        ],
      },
      {
        title: "How to choose an icon",
        steps: [
          "Click the dropdown for **Icon Name**.",
          "These words (like Users, Music, Mic) are converted into beautiful graphics on the website automatically.",
        ],
      },
      {
        title: "How to upload a cover photo",
        steps: [
          "Click the upload area or drag a photo from your computer into the box to give the department a beautiful header image.",
        ],
      },
      {
        title: "How to reorder departments",
        steps: [
          "In the list of departments, look for the **Up** and **Down** arrow buttons.",
          "Click them to change the order in which departments appear on the public website.",
        ],
      },
      {
        title: "What the 'Active' toggle does",
        steps: [
          "If **Active** is ON, visitors can see the department.",
          "If **Active** is OFF, the department is hidden from the public website.",
        ],
      },
    ],
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: ImageIcon,
    path: "/admin/gallery",
    content: [
      {
        title: "How to create an album",
        steps: [
          "Click **Create Album**.",
          "Give it a Title and select a Category.",
        ],
      },
      {
        title: "How to upload multiple photos",
        steps: [
          "While creating or editing an album, click the upload area or drag multiple photos from your computer into the box.",
          "Wait for the progress bars to finish uploading all images.",
        ],
      },
      {
        title: "How to set the album cover photo",
        steps: [
          "The first photo you upload automatically becomes the cover.",
          "You can drag the photos around to reorder them and change the cover.",
        ],
      },
      {
        title: "How to add captions to photos",
        steps: [
          "After a photo uploads, a text box appears under it.",
          "Type your caption there. Visitors will see this when they view the photo full screen.",
        ],
      },
      {
        title: "How to delete an album",
        steps: [
          "Find the album in the list.",
          "Click the **Trash can icon** to permanently delete it and all its photos.",
        ],
      },
    ],
  },
  {
    id: "give",
    title: "Give Options",
    icon: CreditCard,
    path: "/admin/give",
    content: [
      {
        title: "How to create a new giving category",
        steps: [
          "Click **New Option**.",
          "Give it a Title (like 'Tithes' or 'Building Fund') and a description.",
          "Click **Save**.",
        ],
      },
      {
        title: "How to enable Paystack or Bank Transfer",
        steps: [
          "Check the box for **Enable Paystack** if you want people to pay online with their cards.",
          "Check the box for **Enable Bank Transfer** if you want them to manually send money and upload a receipt.",
        ],
      },
      {
        title: "How to add bank account details",
        steps: [
          "If Bank Transfer is enabled, click **Add Bank Account**.",
          "Enter the Bank Name, Account Number, and Account Name.",
          "You can add multiple accounts by clicking the button again.",
        ],
      },
      {
        title: "What 'Goal Amount' means",
        steps: [
          "If you enter a **Goal Amount**, a progress bar will appear on the public website showing how much has been raised versus the goal.",
          "Leave it empty if there is no specific goal.",
        ],
      },
      {
        title: "What visitors see",
        steps: [
          "Visitors will see all active giving categories on the Give page.",
          "When they select one, they will be guided to pay via card or bank transfer based on what you enabled.",
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    icon: BanknotesIcon, // we can use CreditCard or similar
    path: "/admin/payments",
    content: [
      {
        title: "Understanding payment statuses",
        steps: [
          "**Verified**: The money is confirmed to be in your account.",
          "**Pending**: A bank transfer receipt was uploaded and is waiting for you to check it.",
          "**Rejected**: The uploaded receipt was invalid or fake.",
        ],
      },
      {
        title: "How Paystack payments work",
        steps: [
          "Paystack payments are automatically marked as **Verified** by the system.",
          "You do not need to do anything for these.",
        ],
      },
      {
        title: "How to view a bank transfer proof",
        steps: [
          "Find a **Pending** payment in the list.",
          "Click **Review** or the **Eye icon** to see the screenshot the person uploaded.",
        ],
      },
      {
        title: "How to verify or reject a payment",
        steps: [
          "While viewing the receipt, check your actual bank app to confirm the money arrived.",
          "If it did, click **Verify Payment**.",
          "If it didn't, click **Reject**, type a reason, and confirm. An email will be sent to the person.",
        ],
      },
    ],
  },
  {
    id: "subscribers",
    title: "Subscribers",
    icon: UserCheck,
    path: "/admin/subscribers",
    content: [
      {
        title: "How to view all subscribers",
        steps: [
          "The table shows everyone who has joined the chapel's mailing list from the website.",
        ],
      },
      {
        title: "How to send a message to all subscribers",
        steps: [
          "Click **Send Message** at the top.",
          "Write your Subject and Message.",
          "Make sure **All Subscribers** is selected.",
          "Click **Send**.",
        ],
      },
      {
        title: "How to send a message to specific people",
        steps: [
          "Click **Send Message**.",
          "Click **Select Specific**.",
          "Check the boxes next to the names of the people you want to email.",
          "Click **Send**.",
        ],
      },
      {
        title: "How to remove a subscriber",
        steps: [
          "Click the **Trash can icon** next to their name.",
          "They will no longer receive mass emails from the system.",
        ],
      },
    ],
  },
  {
    id: "contact-messages",
    title: "Contact Messages",
    icon: Mail,
    path: "/admin/contact-messages",
    content: [
      {
        title: "How to view messages",
        steps: [
          "Click the **Chevron down arrow** next to any message to expand it and read the full content.",
        ],
      },
      {
        title: "How to mark a message as read",
        steps: [
          "Click the **Open Mail icon** to mark it as read. This helps you keep track of what you have already seen.",
        ],
      },
      {
        title: "How to delete a message",
        steps: [
          "Click the **Trash can icon** to permanently delete the message from the system.",
        ],
      },
    ],
  },
  {
    id: "prayer-requests",
    title: "Prayer Requests",
    icon: Heart,
    path: "/admin/prayer-requests",
    content: [
      {
        title: "Understanding private requests",
        steps: [
          "If a request is marked as Private, the system will blur the text to protect confidentiality.",
        ],
      },
      {
        title: "How to view a private prayer request",
        steps: [
          "Click the **Eye icon** to view the request details.",
          "Click the **Reveal Private Content** button. Only do this when you are alone and secure.",
        ],
      },
      {
        title: "How to delete a request",
        steps: [
          "Click the **Trash can icon** to permanently delete it. It is good practice to delete highly sensitive requests after praying over them.",
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
    content: [
      {
        title: "How to update general details",
        steps: [
          "In the **General** tab, you can change the chapel's name, phone number, address, and social media links.",
          "Click **Save Changes** at the bottom.",
        ],
      },
      {
        title: "How to upload hero images",
        steps: [
          "In the **Homepage** tab, look for the Hero Images section.",
          "Click the upload area or drag photos from your computer into the box.",
          "These photos create the beautiful sliding background on the main website.",
        ],
      },
      {
        title: "How to set the scripture verse",
        steps: [
          "In the **Homepage** tab, type the verse text and the reference (like 'John 3:16').",
          "This will update the daily scripture shown to visitors.",
        ],
      },
      {
        title: "How to manage email settings",
        steps: [
          "Go to the **Emails** tab.",
          "Enter the email address that should receive Contact Form messages.",
          "Enter the email address that should receive Prayer Requests.",
          "Click **Send Test Email** to verify it works.",
        ],
      },
      {
        title: "How to enable/disable 2FA",
        steps: [
          "Go to the **Security** tab.",
          "Toggle the **Enable 2FA** switch.",
          "If ON, all admins will need an email code to log in.",
        ],
      },
      {
        title: "How to add Paystack keys",
        steps: [
          "Go to the **Integrations** tab.",
          "Paste your Paystack Secret Key and Public Key.",
          "This is required for online giving to work.",
        ],
      },
    ],
  },
];
