export const hasApiPermission = async (): Promise<boolean> => {
  try {
    const result = await browser.permissions.contains({
      origins: ["https://api.groundedmomentum.com/*"],
    });

    return result;
  } catch (error) {
    console.error("Error checking API permission:", error);
    return false;
  }
};

export const requestApiPermission = (): Promise<boolean> => {
  return browser.permissions
    .request({
      origins: ["https://api.groundedmomentum.com/*"],
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error("Error requesting permission:", error);

      throw error;
    });
};