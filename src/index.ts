import {app} from "./app";
import {SETTINGS} from "./settings";
import {connectToDB} from "./db/mongodb";

app.listen(SETTINGS.PORT,async () => {
    await connectToDB()
    console.log('...server started in port ' + SETTINGS.PORT)
})

console.log('Hello world')