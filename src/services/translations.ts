/**
 * Multi-Language Translations for Sathaye College Portal
 * Supports English, Hindi (हिन्दी), and Marathi (मराठी)
 */

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface Translations {
  // Top utility ribbon
  topRibbon: {
    language: string;
    hindi: string;
    marathi: string;
    english: string;
    fontSizeDecrease: string;
    fontSizeNormal: string;
    fontSizeIncrease: string;
    accessibilityTools: string;
    skipToMain: string;
    phone: string;
    email: string;
    autonomousBadge: string;
  };
  // Navigation
  nav: {
    home: string;
    smartCampus: string;
    about: string;
    departments: string;
    admissions: string;
    studentSection: string;
    contact: string;
    map: string;
    canteen: string;
    library: string;
    events: string;
    sos: string;
    portal: string;
  };
  // Landing Page
  home: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    discoverMore: string;
    admissionsBtn: string;
    latestUpdates: string;
    principalDesk: string;
    quickServices: string;
    exploreCampus: string;
  };
  // Accessibility Modal
  a11yModal: {
    title: string;
    subtitle: string;
    highContrast: string;
    highContrastDesc: string;
    grayscale: string;
    grayscaleDesc: string;
    invertColors: string;
    invertColorsDesc: string;
    tts: string;
    ttsDesc: string;
    dyslexicFont: string;
    dyslexicFontDesc: string;
    highlightLinks: string;
    highlightLinksDesc: string;
    readingGuide: string;
    readingGuideDesc: string;
    resetAll: string;
    close: string;
    on: string;
    off: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    topRibbon: {
      language: 'Language',
      hindi: 'हिन्दी',
      marathi: 'मराठी',
      english: 'English',
      fontSizeDecrease: 'Decrease font size (A-)',
      fontSizeNormal: 'Default font size (A)',
      fontSizeIncrease: 'Increase font size (A+)',
      accessibilityTools: 'Accessibility Options',
      skipToMain: 'Skip to main content',
      phone: '+91 9321347772',
      email: 'sathayecollege@gmail.com',
      autonomousBadge: 'Autonomous Campus (2021-31)',
    },
    nav: {
      home: 'Home',
      smartCampus: 'Smart Campus',
      about: 'About',
      departments: 'Departments',
      admissions: 'Admissions',
      studentSection: 'Student Section',
      contact: 'Contact',
      map: '2D Map',
      canteen: 'Canteen',
      library: 'Library',
      events: 'Events',
      sos: 'SOS / Safety',
      portal: 'Smart Portal',
    },
    home: {
      welcomeTitle: 'Welcome to Sathaye College',
      welcomeSubtitle: 'Empowering minds since 1959 • NAAC "A" Grade Autonomous College',
      discoverMore: 'Discover More',
      admissionsBtn: 'Admissions 2026',
      latestUpdates: 'Latest Updates',
      principalDesk: "Principal's Desk",
      quickServices: 'Campus Services & Digital Portals',
      exploreCampus: 'Explore Sathaye Campus',
    },
    a11yModal: {
      title: 'Accessibility Controls',
      subtitle: 'Compliant with WCAG 2.1 AA & GIGW standards',
      highContrast: 'High Contrast Mode',
      highContrastDesc: 'Yellow on black high contrast theme',
      grayscale: 'Grayscale / Monochrome',
      grayscaleDesc: 'Removes all colors for visual clarity',
      invertColors: 'Invert Colors',
      invertColorsDesc: 'Inverts color spectrum with media protection',
      tts: 'Screen Reader & Voice Narrator',
      ttsDesc: 'Narrates page sections using speech synthesis',
      dyslexicFont: 'Dyslexia-Friendly Font',
      dyslexicFontDesc: 'Enhances character distinction and spacing',
      highlightLinks: 'Highlight All Links',
      highlightLinksDesc: 'Adds clear yellow underlines to hyperlinks',
      readingGuide: 'Reading Guide Line',
      readingGuideDesc: 'Horizontal line ruler following the pointer',
      resetAll: 'Reset to Default Settings',
      close: 'Close',
      on: 'ON',
      off: 'OFF',
    },
  },
  hi: {
    topRibbon: {
      language: 'भाषा',
      hindi: 'हिन्दी',
      marathi: 'मराठी',
      english: 'English',
      fontSizeDecrease: 'फ़ॉन्ट आकार घटाएं (A-)',
      fontSizeNormal: 'सामान्य फ़ॉन्ट आकार (A)',
      fontSizeIncrease: 'फ़ॉन्ट आकार बढ़ाएं (A+)',
      accessibilityTools: 'सुलभता विकल्प (Accessibility)',
      skipToMain: 'मुख्य सामग्री पर जाएं',
      phone: '+91 9321347772',
      email: 'sathayecollege@gmail.com',
      autonomousBadge: 'स्वायत्त महाविद्यालय (2021-31)',
    },
    nav: {
      home: 'मुख्यपृष्ठ',
      smartCampus: 'स्मार्ट कैंपस',
      about: 'कॉलेज परिचय',
      departments: 'विभाग',
      admissions: 'प्रवेश',
      studentSection: 'छात्र अनुभाग',
      contact: 'संपर्क',
      map: '2D मैप',
      canteen: 'कैंटीन',
      library: 'पुस्तकालय',
      events: 'आयोजन',
      sos: 'आपातकालीन SOS',
      portal: 'स्मार्ट पोर्टल',
    },
    home: {
      welcomeTitle: 'साठ्ये कॉलेज में आपका स्वागत है',
      welcomeSubtitle: '१९५९ से शिक्षा एवं नवाचार • नैक "A" ग्रेड स्वायत्त महाविद्यालय',
      discoverMore: 'और अधिक जानें',
      admissionsBtn: 'प्रवेश २०२६',
      latestUpdates: 'ताजा अपडेट्स',
      principalDesk: 'प्राचार्य का संदेश',
      quickServices: 'कैंपस सेवाएं और डिजिटल पोर्टल',
      exploreCampus: 'साठ्ये कैंपस देखें',
    },
    a11yModal: {
      title: 'सुलभता नियंत्रण (Accessibility Controls)',
      subtitle: 'WCAG 2.1 AA और भारत सरकार GIGW मानकों के अनुरूप',
      highContrast: 'उच्च कंट्रास्ट मोड',
      highContrastDesc: 'स्पष्ट पठनीयता हेतु पीला व काला रंग',
      grayscale: 'मोनोक्रोम / ग्रेस्केल',
      grayscaleDesc: 'आंखों की सुरक्षा हेतु रंग हटाएं',
      invertColors: 'रंग उलटें (Invert Colors)',
      invertColorsDesc: 'कलर स्पेक्ट्रम को उलटना',
      tts: 'स्क्रीन रीडर / टेक्स्ट-टू-स्पीच',
      ttsDesc: 'वेबसाइट सामग्री को बोलकर सुनाने वाला सहायक',
      dyslexicFont: 'डिस्लेक्सिया-अनुकूल फ़ॉन्ट',
      dyslexicFontDesc: 'सरल अक्षरों के साथ सहज पठन',
      highlightLinks: 'सभी लिंक्स को हाइलाइट करें',
      highlightLinksDesc: 'हाइपरलिंक के नीचे स्पष्ट पीली रेखाएं',
      readingGuide: 'रीडिंग गाइड रेखा',
      readingGuideDesc: 'माउस कर्सर के साथ चलने वाली पढ़ने की रेखा',
      resetAll: 'सभी सेटिंग्स रीसेट करें',
      close: 'बंद करें',
      on: 'सक्रिय',
      off: 'निष्क्रिय',
    },
  },
  mr: {
    topRibbon: {
      language: 'भाषा',
      hindi: 'हिन्दी',
      marathi: 'मराठी',
      english: 'English',
      fontSizeDecrease: 'अक्षरांचा आकार कमी करा (A-)',
      fontSizeNormal: 'मूळ अक्षरांचा आकार (A)',
      fontSizeIncrease: 'अक्षरांचा आकार वाढवा (A+)',
      accessibilityTools: 'सुलभता साधने (Accessibility)',
      skipToMain: 'मुख्य मजकुराकडे जा',
      phone: '+91 9321347772',
      email: 'sathayecollege@gmail.com',
      autonomousBadge: 'स्वायत्त महाविद्यालय (२०२१-३१)',
    },
    nav: {
      home: 'मुख्यपृष्ठ',
      smartCampus: 'स्मार्ट कॅम्पस',
      about: 'महाविद्यालयाबद्दल',
      departments: 'विभाग',
      admissions: 'प्रवेश',
      studentSection: 'विद्यार्थी विभाग',
      contact: 'संपर्क',
      map: '२D नकाशा',
      canteen: 'कॅन्टीन',
      library: 'ग्रंथालय',
      events: 'कार्यक्रम',
      sos: 'आपत्कालीन SOS',
      portal: 'स्मार्ट पोर्टल',
    },
    home: {
      welcomeTitle: 'साठ्ये महाविद्यालयात आपले सहर्ष स्वागत आहे',
      welcomeSubtitle: '१९५९ पासून ज्ञानसाधना • नॅक "A" दर्जा स्वायत्त महाविद्यालय',
      discoverMore: 'अधिक जाणून घ्या',
      admissionsBtn: 'प्रवेश २०२६',
      latestUpdates: 'नवीनतम सूचना',
      principalDesk: 'प्राचार्यांचे मनोगत',
      quickServices: 'कॅम्पस सेवा व डिजिटल पोर्टल्स',
      exploreCampus: 'साठ्ये परिसर पहा',
    },
    a11yModal: {
      title: 'सुलभता नियंत्रण (Accessibility Controls)',
      subtitle: 'WCAG 2.1 AA आणि GIGW मानकांनुसार प्रमाणित',
      highContrast: 'हाय कॉन्ट्रास्ट मोड',
      highContrastDesc: 'वाचनासाठी पिवळा व काळा रंग',
      grayscale: 'ग्रेस्केल / मोनोक्रोम',
      grayscaleDesc: 'डोळ्यांच्या आरामासाठी रंग काढून टाका',
      invertColors: 'रंग उलट करा',
      invertColorsDesc: 'स्क्रीनवरील रंग उलट दाखवा',
      tts: 'स्क्रीन रीडर / बोलणारा आवाज',
      ttsDesc: 'वेबसाइटवरील मजकूर वाचून दाखवणारी यंत्रणा',
      dyslexicFont: 'डिस्लेक्सिया-स्नेही फॉन्ट',
      dyslexicFontDesc: 'सुलभ अक्षरे आणि अंतरासह वाचन',
      highlightLinks: 'सर्व लिंक्स ठळक करा',
      highlightLinksDesc: 'सर्व हायपरलिंक्सखाली पिवळी रेषा',
      readingGuide: 'वाचन मार्गदर्शक पट्टी',
      readingGuideDesc: 'कर्सरसोबत फिरणारी वाचन पट्टी',
      resetAll: 'मूळ स्थितीत आणा',
      close: 'बंद करा',
      on: 'सुरू',
      off: 'बंद',
    },
  },
};
