export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
}

export function getUserFriendlyError(error: any): UserFriendlyError {
  const errorMessage = error?.message || String(error);
  const errorCode = error?.code;

  if (errorCode === 'AI_SERVICE_UNAVAILABLE' || errorMessage.includes('GEMINI_API_KEY')) {
    return {
      title: 'هوش مصنوعی در دسترس نیست',
      message: 'برای استفاده از قابلیت‌های هوش مصنوعی، لطفاً کلید API گوگل جمینی را تنظیم کنید.',
      action: 'از منوی تنظیمات، کلید API خود را وارد کنید.'
    };
  }

  if (errorCode === 'VALIDATION_ERROR' || errorMessage.includes('validation')) {
    return {
      title: 'اطلاعات نامعتبر',
      message: 'لطفاً اطلاعات وارد شده را بررسی و دوباره تلاش کنید.',
      action: 'مطمئن شوید که تمام فیلدها به درستی پر شده‌اند.'
    };
  }

  if (errorCode === 'INVALID_TEST_CODE') {
    return {
      title: 'خطا در تولید تست',
      message: 'کد تست تولید شده معتبر نیست. لطفاً دوباره تلاش کنید.',
      action: 'فایل را بررسی کنید و مطمئن شوید که کد قابل تست است.'
    };
  }

  if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
    return {
      title: 'مشکل در اتصال',
      message: 'اتصال به سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.',
      action: 'اتصال اینترنت را چک کرده و دوباره تلاش کنید.'
    };
  }

  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return {
      title: 'یافت نشد',
      message: 'آیتم مورد نظر پیدا نشد. ممکن است حذف شده باشد.',
      action: 'لیست را رفرش کرده و دوباره تلاش کنید.'
    };
  }

  if (errorMessage.includes('500') || errorMessage.includes('Internal')) {
    return {
      title: 'خطای سرور',
      message: 'مشکلی در سرور رخ داده است. لطفاً چند لحظه دیگر تلاش کنید.',
      action: 'اگر مشکل ادامه داشت، به ما اطلاع دهید.'
    };
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
    return {
      title: 'دسترسی غیرمجاز',
      message: 'شما اجازه دسترسی به این بخش را ندارید.',
      action: 'لطفاً وارد حساب کاربری خود شوید.'
    };
  }

  return {
    title: 'خطایی رخ داد',
    message: errorMessage.length > 100 
      ? 'متاسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'
      : errorMessage,
    action: 'اگر مشکل ادامه داشت، صفحه را رفرش کنید.'
  };
}

export function getEnglishError(error: any): UserFriendlyError {
  const errorMessage = error?.message || String(error);
  const errorCode = error?.code;

  if (errorCode === 'AI_SERVICE_UNAVAILABLE' || errorMessage.includes('GEMINI_API_KEY')) {
    return {
      title: 'AI Service Unavailable',
      message: 'Please configure your Google Gemini API key to use AI features.',
      action: 'Add your API key in Settings.'
    };
  }

  if (errorCode === 'VALIDATION_ERROR' || errorMessage.includes('validation')) {
    return {
      title: 'Invalid Input',
      message: 'Please check your input and try again.',
      action: 'Make sure all fields are filled correctly.'
    };
  }

  if (errorCode === 'INVALID_TEST_CODE') {
    return {
      title: 'Test Generation Failed',
      message: 'Generated test code is invalid. Please try again.',
      action: 'Check the file and make sure it is testable.'
    };
  }

  if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
    return {
      title: 'Connection Error',
      message: 'Could not connect to server. Please check your internet connection.',
      action: 'Check your connection and try again.'
    };
  }

  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return {
      title: 'Not Found',
      message: 'The requested item was not found. It may have been deleted.',
      action: 'Refresh the list and try again.'
    };
  }

  if (errorMessage.includes('500') || errorMessage.includes('Internal')) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on the server. Please try again in a few moments.',
      action: 'If the problem persists, please contact us.'
    };
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
    return {
      title: 'Unauthorized Access',
      message: 'You do not have permission to access this section.',
      action: 'Please sign in to your account.'
    };
  }

  return {
    title: 'An Error Occurred',
    message: errorMessage.length > 100 
      ? 'Something went wrong. Please try again.'
      : errorMessage,
    action: 'If the problem persists, please refresh the page.'
  };
}
