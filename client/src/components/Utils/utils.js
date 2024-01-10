export const getDate = () =>{
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
        const today = new Date();
    return monthNames[today.getMonth()]+" "+today.getDate()+","+today.getFullYear()
}