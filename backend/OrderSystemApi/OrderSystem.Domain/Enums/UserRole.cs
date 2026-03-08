using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Enums
{
    public enum UserRole
    {
        // وضعت هاي الارقام لحتى اتفادى القيم الافتراضيه اللي بتبدأ من 0
        // هاي الارقام مش  هتفيدنا بشي بس في حال احتجنا نتعامل معهم كأرقام في المستقبل
       CUSTOMER =1,
        MANAGER,
        ADMIN
    }
}
