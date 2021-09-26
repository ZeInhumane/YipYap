class is_lvlup {
    constructor(current_exp, user_lvl, user_name) {
        let total_lvls = 0;
        let next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 15));
        console.log(next_lvl)
        while (current_exp >= next_lvl) {
            current_exp -= next_lvl;
            total_lvls++;
            user_lvl++;
            next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 15));
            console.log(next_lvl)
        }
        this.total_lvls = total_lvls;
        this.current_exp = current_exp;
        this.next_lvl = next_lvl;
        this.user_name = user_name;
        this.user_lvl = user_lvl;
    }
    level_up() {
        if (this.total_lvls > 0) {
            return `Congratulations! ${this.user_name} has gained ${this.total_lvls} levels!\n${this.user_name} is now at **level ${this.user_lvl}!**\n${this.user_name} has gained **${5 * this.total_lvls} SP!**`;
        }
        return '';
    }
    new_exp() {
        return this.current_exp;
    }
    new_lvl() {
        return this.user_lvl;
    }
    new_sp() {
        let add_sp = 0;
        if (this.total_lvls > 0) {
            add_sp = this.total_lvls * 5;
        }
        return add_sp;
    }
}
module.exports = is_lvlup;