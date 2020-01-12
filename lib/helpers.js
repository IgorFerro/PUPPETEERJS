module.exports={
    click: async function(page , selector){
     try {
         await page.waitForSelector(selector)
         await page.click(selector)
        
     } catch (error) {
        throw new Error(`Could no click on selector: ${selector}`) 
     }
    },
}